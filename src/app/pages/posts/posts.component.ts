import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: IPost[] = [];
  postsSubscription!: Subscription;
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postsSubscription = this.postService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  ngOnDestroy() {
    this.postsSubscription && this.postsSubscription.unsubscribe();
  }
}
