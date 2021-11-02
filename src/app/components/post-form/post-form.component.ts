import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, EMPTY, map, startWith, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';
import { NotificationService } from 'src/app/services/Notification.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent implements OnInit {
  postId = '';
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  selectedPostId = this.route.paramMap.pipe(
    map((paramMap) => {
      let id = paramMap.get('id');
      if (id) {
        this.postId = id;
      }
      this.postService.selectPost(id + '');
      return id;
    })
  );

  post$ = this.postService.post$.pipe(
    tap((post) => {
      post &&
        this.postForm.setValue({
          title: post?.title,
          description: post?.description,
          categoryId: post?.categoryId,
        });
    }),
    catchError((error) => {
      this.notificationService.setErrorMessage(error);
      return EMPTY;
    })
  );

  notification$ = this.postService.postCRUDCompleteAction$.pipe(
    startWith(false),
    tap((message) => {
      if (message) {
        this.router.navigateByUrl('/declarativeposts');
      }
    })
  );

  categories$ = this.categoryService.categories$;

  vm$ = combineLatest([this.selectedPostId, this.post$, this.notification$]);

  constructor(
    private categoryService: DeclarativeCategoryService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private postService: DeclarativePostService
  ) {}

  ngOnInit(): void {}

  onPostSubmit() {
    let postDetails = this.postForm.value;
    if (this.postId) {
      postDetails = { ...postDetails, id: this.postId };
      this.postService.updatePost(postDetails);
    } else {
      this.postService.addPost(postDetails);
    }
  }
}
