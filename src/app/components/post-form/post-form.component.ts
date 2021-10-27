import { Component, OnInit } from '@angular/core';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  categories$ = this.categoryService.categories$;

  constructor(private categoryService: DeclarativeCategoryService) {}

  ngOnInit(): void {}
}
