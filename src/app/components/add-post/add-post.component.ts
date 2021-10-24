import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent implements OnInit {
  postForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    categoryId: new FormControl(''),
  });

  categories$ = this.categoryService.categories$;
  constructor(private categoryService: DeclarativeCategoryService) {}

  ngOnInit(): void {}

  onAddPost() {
    console.log(this.postForm.value);
  }
}
