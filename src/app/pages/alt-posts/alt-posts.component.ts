import { Component, OnInit } from '@angular/core';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';

@Component({
  selector: 'app-alt-posts',
  templateUrl: './alt-posts.component.html',
  styleUrls: ['./alt-posts.component.scss'],
})
export class AltPostsComponent {
  posts$ = this.postService.postsWithCategory$;
  constructor(private postService: DeclarativePostService) {}

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    console.log(post);
  }
}
