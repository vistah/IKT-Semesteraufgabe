importScripts('/src/js/idb.js');
importScripts('/src/js/db.js');

const CURRENT_STATIC_CACHE = 'static-v11';
const CURRENT_DYNAMIC_CACHE = 'dynamic-v11';

const STATIC_FILES =[
    '/',
    '/index.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/css/help.css',
    '/help/index.html',
    '/src/js/material.min.js',
    '/src/js/idb.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/htw.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css',
    '/manifest.webmanifest',
    '/src/images'
];
//Static Cache
self.addEventListener('install', event => {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
    caches.open(CURRENT_STATIC_CACHE)
    .then(cache =>{
    console.log('Service-Worker-Cache erzeugt und offen.');
    cache.addAll(STATIC_FILES);
    })
   );
})

self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    event.waitUntil(
            caches.keys()
                .then( keyList => {
                    return Promise.all(keyList.map( key => {
                    //Alter Cache wird gelöscht
                        if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                            console.log('service worker --> old cache removed :', key);
                            return caches.delete(key);
                        }
                    }))
                })
        );
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    if (!(event.request.url.indexOf('http') === 0)) return;


    const url = 'http://localhost:3000/posts';
        if(event.request.url.indexOf(url) >= 0) {
            event.respondWith(
                fetch(event.request)
                    .then ( res => {
                        const clonedResponse = res.clone();
                        clearAllData('posts')
                            .then(() => {
                                return clonedResponse.json();
                            })
                                    .then( data => {
                                        for(let key in data)
                                        {
                                            //console.log('write data', data[key]);
                                            writeData('posts', data[key]);
                                            //if(data[key].id === 9) deleteOneData('posts', 9);
                                        }
                                        //deleteByTitle('posts','TEst');
                                    });
                        // hier Anfrage an http://localhost:3000/posts behandeln
                        return res;
                    })
            )
    }
    else
    {
    //Dynamic Cache
    //Nicht alles im dynamischen Cache, um die Anwendung nicht zu verlangsamen/ Nicht alle Objekte, die
    // in den Cache sollten, sind uns bekannt.
        event.respondWith(
                caches.match(event.request)
                    .then( response => {
                        if(response) {
                            return response;
                        } else {
                            return fetch(event.request)
                                .then( res => {
                                    return caches.open(CURRENT_DYNAMIC_CACHE)      // neuer, weiterer Cache namens dynamic
                                        .then( cache => {
                                            cache.put(event.request.url, res.clone());
                                            return res;
                                        })
                                });
                        }
                })
        )}
})

//Synchronisation --> Ins Formular eingetragene Objekte werden, in die IndexedDB 'posts' übernommen.
//Wenn die Anwendung offline ist, werden sie zunächst in die 'sync-posts' eingetragen. Beim online Gehen werden die Daten in die IndexedDB eingetragen.
self.addEventListener('sync', event => {
    console.log('service worker --> background syncing ...', event);
    if(event.tag === 'sync-new-post') {
        console.log('service worker --> syncing new posts ...');
        event.waitUntil(
            readAllData('sync-posts')
                .then( dataArray => {
                    for(let data of dataArray) {
                        console.log('data from IndexedDB', data);
                        fetch('http://localhost:3000/posts', {
                            method: 'POST',
                            headers:{
                                'Content-Type':'application/json',
                                'Accept': 'application/json',
                            },
                            //Inhalt
                            body: JSON.stringify({
                                id:null,
                                title: data.title,
                                author: data.author,
                                location: data.location,
                                genre: data.genre,
                                publisher: data.publisher,
                                published: data.published,
                                image: data.image,
                            })
                        })
                        .then(response => {
                            console.log('Data sent to backend...', response);
                            if(response.ok)
                            {
                                deleteOneData('sync-posts', data.id)
                            }
                        })
                        .catch(err => {
                            console.log('Error while sending data to backend...', err);
                        })
                    }
                })
        );
    }
})
