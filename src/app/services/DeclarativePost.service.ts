import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  combineLatest,
  forkJoin,
  Subject,
  catchError,
  throwError,
  shareReplay,
  share,
  delay,
  scan,
  BehaviorSubject,
  merge,
  concatMap,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { CRUDAction, IPost } from '../models/IPost';
import { DeclarativeCategoryService } from './DeclarativeCategory.service';

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

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPosts(posts, value);
    }, [] as IPost[]),
    shareReplay(1)
  );

  modifyPosts(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }
    } else {
      return value;
    }

    return posts;
  }

  savePosts(postAction: CRUDAction<IPost>) {
    if (postAction.action === 'add') {
      return this.addPostToServer(postAction.data).pipe(
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

    return of(postAction.data);
  }

  addPostToServer(post: IPost) {
    return this.http
      .post<{ name: string }>(
        `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`,
        post
      )
      .pipe(
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
    private categoryService: DeclarativeCategoryService
  ) {}

  handleError(error: Error) {
    return throwError(() => {
      return 'unknown error occurred. Please try again';
    });
  }
}
