import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  categories$ = this.categoryService.categories$;
  postDetails!: IPost;

  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  selectedPost$ = this.route.paramMap.pipe(
    tap((params) => {
      this.postService.selectPost(params.get('id') + '');
    })
  );

  postComplete$ = this.postService.postCompleteAction$.pipe(
    tap((data) => this.router.navigateByUrl('/declarativeposts'))
  );

  post$ = this.postService.post$.pipe(
    startWith({ title: '', description: '', categoryId: '' } as IPost),
    tap((post) => {
      if (post) {
        this.postDetails = post;
      }

      this.postForm.setValue({
        title: post?.title,
        description: post?.description,
        categoryId: post?.categoryId,
      });
    })
  );

  vm$ = combineLatest([this.selectedPost$, this.post$]).pipe(
    map(([selectedPost, post]) => {
      return {
        post,
      };
    })
  );

  constructor(
    private categoryService: DeclarativeCategoryService,
    private postService: DeclarativePostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onPostSubmit() {
    let postDetails: IPost = this.postForm.value;
    if (this.postDetails.id) {
      postDetails = {
        ...postDetails,
        id: this.postDetails.id,
      };
      this.postService.updatePost(postDetails);
    } else {
      this.postService.addPost(postDetails);
    }
  }
}
