import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  selectedPostId = this.route.paramMap.pipe(
    map((paramMap) => {
      let id = paramMap.get('id');
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
    })
  );

  categories$ = this.categoryService.categories$;

  vm$ = combineLatest([this.selectedPostId, this.post$]);

  constructor(
    private categoryService: DeclarativeCategoryService,
    private route: ActivatedRoute,
    private postService: DeclarativePostService
  ) {}

  ngOnInit(): void {}

  onPostSubmit() {
    console.log(this.postForm.value);
  }
}
