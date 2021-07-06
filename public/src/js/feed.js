let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let form = document.querySelector('form');
let titleInput = document.querySelector('#title');
let authorInput = document.querySelector('#author');
let locationInput = document.querySelector('#location');
let genreInput = document.querySelector('#genre');
let publisherInput = document.querySelector('#publisher');
let publishedInput = document.querySelector('#published');

function openCreatePostModal() {
  createPostArea.style.transform = 'translateY(0)';
}

function closeCreatePostModal() {
  createPostArea.style.transform = 'translateY(100vH)';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(data) {
  let cardWrapper = document.createElement('div');
  let cardTitle = document.createElement('div');
  let cardTitleTextElement = document.createElement('h2');
  let cardSupportingText = document.createElement('div');
  let cardLocation = document.createElement('div');
  let cardGenre = document.createElement('div');
  let cardPublisher = document.createElement('div');
  let cardPublished = document.createElement('div');
  //genre, publisher, published

  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';


  let image = new Image();
  image.src = "data:image/png;base64," + data.image;
  cardTitle.style.backgroundImage = 'url('+image.src+')';

  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '520px';
  cardTitle.style.width = '350px';

  cardWrapper.appendChild(cardTitle);
  cardWrapper.appendChild(cardLocation);
  cardWrapper.appendChild(cardGenre);
  cardWrapper.appendChild(cardPublisher);
  cardWrapper.appendChild(cardPublished);

  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitleTextElement.style.fontWeight = 'bold';
  cardTitleTextElement.style.background = 'white';
  cardTitleTextElement.style.fontSize = '15px';
  cardTitle.appendChild(cardTitleTextElement);

  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Autor: '+data.author;
  cardSupportingText.style.width = '350px';

  cardLocation.className = 'mdl-card__location-text';
  cardLocation.textContent = 'Ort: '+data.location;
  cardLocation.style.fontSize='15px';
  cardLocation.style.width = '350px';

  cardGenre.className = 'mdl-card__genre-text';
  cardGenre.textContent = 'Genre: '+data.genre;
  cardGenre.style.fontSize='15px';
  cardGenre.style.width = '350px';

  cardPublisher.className = 'mdl-card__publisher-text';
  cardPublisher.textContent = 'Verlag: '+data.publisher;
  cardPublisher.style.fontSize='15px';
  cardPublisher.style.width = '350px';

  cardPublished.className = 'mdl-card__published-text';
  cardPublished.textContent = 'Jahr der Veröffentlichung: '+data.published;
  cardPublished.style.fontSize='15px';
  cardPublished.style.width = '350px';

  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data)
{
    for (let i=0; i < data.length; i++)
    {
        createCard(data[i]);
    }
}

let networkDataReceived = false;

fetch('http://localhost:3000/posts')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      networkDataReceived = true;
      console.log('From backend ...', data);
      updateUI(data);
    });

/*if('indexedDB' in window) {
    readAllData('posts')
        .then( data => {
            if(!networkDataReceived) {
                console.log('From cache ...', data);
                updateUI(data);
            }
        })
}*/


function sendDataToBackend() {
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            id: null,
            title: titleInput.value,
            author: authorInput.value,
            location: locationInput.value,
            genre: genreInput.value,
            publisher: publisherInput.value,
            published: publishedInput.value,
            image: '',
            })
    })
    .then( response => {
        console.log('Data sent to backend ...', response);
        return response.json();
    })
    .then( data => {
        console.log('data ...', data);
        updateUI(Object.entries(data));
    });
}


form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    if (titleInput.value.trim() === '' || authorInput.value.trim() === '' || locationInput.value.trim()=== '' || genreInput.value.trim() === '' || publishedInput.value.trim() === '' || publisherInput.value.trim() === '') {
        alert('Bitte Titel und Autor angeben!')
        return;
    }

    closeCreatePostModal();

   if('serviceWorker' in navigator && 'SyncManager' in window){
        navigator.serviceWorker.ready
            .then(sw => {
                let post = {
                    id: new Date().toISOString(),
                    title: titleInput.value,
                    author: authorInput.value,
                    location: locationInput.value,
                    genre: genreInput.value,
                    publisher: publisherInput.value,
                    published: publishedInput.value,
                };
                writeData('sync-posts', post)
                    .then(() => {
                        return sw.sync.register('sync-new-post');
                    })
                    .then(() => {
                        let snackbarContainer = new MaterialSnackbar(document.querySelector('#confirmation-toast'));
                        let data = {message: 'Eingabe zum Synchronisieren gespeichert!', timeout: 8000};
                        snackbarContainer.showSnackbar(data);
                    });
            });
    }
    else
    {
        sendDataToBackend();
    }
});


