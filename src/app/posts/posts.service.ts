import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((data) => {
        this.posts = data.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: data.maxPosts,
        });
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image as string,
        creator: null,
      };
    }
    this.http
      .put<{ message: string }>(BACKEND_URL + `/${id}`, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + `/${postId}`);
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + `/${id}`);
  }
}
