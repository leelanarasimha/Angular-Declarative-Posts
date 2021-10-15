import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-declarative-posts',
  templateUrl: './declarative-posts.component.html',
  styleUrls: ['./declarative-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePostsComponent {
  selectedCategoryId = '';
  posts$ = this.postService.postsWithCategory$;
  categories$ = this.categoryService.categories$;

  filteredPosts$ = this.posts$.pipe(
    map((posts) => {
      return posts.filter((post) =>
        this.selectedCategoryId
          ? post.categoryId === this.selectedCategoryId
          : true
      );
    })
  );

  constructor(
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService
  ) {}
  onCategoryChange(event: Event) {
    let selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = selectedCategoryId;
  }
}
