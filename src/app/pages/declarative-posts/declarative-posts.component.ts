import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
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

  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

  filteredPosts$ = combineLatest([
    this.posts$,
    this.selectedCategoryAction$,
  ]).pipe(
    map(([posts, selectedCategory]) => {
      return posts.filter((post) =>
        selectedCategory ? post.categoryId === selectedCategory : true
      );
    })
  );

  constructor(
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService
  ) {}
  onCategoryChange(event: Event) {
    let selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategorySubject.next(selectedCategoryId);
  }
}
