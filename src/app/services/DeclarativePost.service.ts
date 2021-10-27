import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  combineLatest,
  Subject,
  catchError,
  throwError,
  shareReplay,
  scan,
  BehaviorSubject,
  concatMap,
  merge,
  of,
  observable,
  tap,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { CRUDAction, IPost } from '../models/IPost';
import { DeclarativeCategoryService } from './DeclarativeCategory.service';
import { NotificationService } from './Notification.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http
    .get<{ [id: string]: IPost }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`
    )
    .pipe(
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      catchError(this.handleError),
      shareReplay(1)
    );

  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    }),
    shareReplay(1),
    catchError(this.handleError)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  private postCompleteSubject = new Subject<string>();
  postCompleteAction$ = this.postCompleteSubject.asObservable();

  postComplete() {
    this.postCompleteSubject.next('');
  }

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => {
            return { ...postAction, data: post };
          })
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPostsToArray(posts, value);
    }, [] as IPost[]),
    shareReplay(1)
  );

  modifyPostsToArray(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }

      if (value.action === 'update') {
        return posts.map((post) =>
          post.id === value.data.id ? value.data : post
        );
      }

      if (value.action === 'delete') {
        return posts.filter((post) => post.id !== value.data.id);
      }
    } else {
      return value;
    }
    return posts;
  }

  savePosts(postAction: CRUDAction<IPost>) {
    let postDetails$!: Observable<IPost>;
    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data);
    }
    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data);
    }
    if (postAction.action === 'delete') {
      postDetails$ = this.deletePostToServer(postAction.data).pipe(
        map((data) => postAction.data)
      );
    }

    return postDetails$.pipe(
      concatMap((post) =>
        this.categoryService.categories$.pipe(
          map((categories) => {
            return {
              ...post,
              categoryName: categories.find(
                (category) => category.id === post.categoryId
              )?.title,
            };
          })
        )
      )
    );
  }

  deletePostToServer(post: IPost) {
    return this.http
      .delete(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${post.id}.json`
      )
      .pipe(
        tap((data) => {
          this.postComplete();
          this.notificationService.setSuccessMessage(
            'Post Deleted Successfully'
          );
        })
      );
  }

  updatePostToServer(post: IPost) {
    let postId = post.id;

    return this.http
      .patch<IPost>(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts/${postId}.json`,
        post
      )
      .pipe(
        tap((data) => {
          this.postComplete();
          this.notificationService.setErrorMessage('Post Updated Successfully');
        })
      );
  }

  addPostToServer(post: IPost) {
    return this.http
      .post<{ name: string }>(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`,
        post
      )
      .pipe(
        tap((data) => {
          this.postComplete();
          this.notificationService.setSuccessMessage(
            'Post Addedd Successfully'
          );
        }),
        map((id) => {
          return {
            ...post,
            id: id.name,
          };
        })
      );
  }

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  updatePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'update', data: post });
  }

  deletePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'delete', data: post });
  }

  private selectedPostSubject = new BehaviorSubject<string>('');
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([this.allPosts$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),

    catchError(this.handleError)
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService,
    private notificationService: NotificationService
  ) {}

  handleError(error: Error) {
    return throwError(() => {
      return 'unknown error occurred. Please try again';
    });
  }
}
