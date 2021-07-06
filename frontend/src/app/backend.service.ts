import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Post {
  id: number;
  title: string;
  author: string;
  genre: string;
  publisher:string;
  location: string;
  published: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }

//POST http://localhost:4200/posts
  public addPost(post: {id:null; title: any; author:any; genre:any; publisher:any; location:any; published:any; image:"";}): Promise<Post> {
    return this.http
      .post<Post>(`${this.apiUrl}`, post,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept-Type': 'application/json',
        }),
      })
      .toPromise();
  }
}
