import { Component, OnInit } from '@angular/core';
import {debounceTime, of} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utlis/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import { DatePipe } from '@angular/common';
import {AuthService} from "../../../core/auth/auth.service";
import {LikeService} from "../../../shared/services/like.service";
import {CommentService} from "../../../shared/services/comment.service";
import {ActiveParamsCommentType} from "../../../../types/active-params-comment.type";
import {CommentType, SingleCommentType} from "../../../../types/comment.type";
import {ArticleActionsType} from "../../../../types/article-actions.type";


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {


  isLogged: boolean = false;
  serverStaticPath = environment.serverStaticPath;
  activeParams: ActiveParamsType = {categories: []};
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  activeParamsComment: ActiveParamsCommentType = {offset: 0, article: ''};

  comments!: CommentType;
  commentInput: string = '';
  noCommentsFlag: boolean = false;

  loadMoreBtnFlag: boolean = false;
  loadMoreClickTimes: number = 0;
  offset: number = 3;
  commentsCount: number = 0;
  likedCommentFlag: boolean = false;
  dislikedCommentFlag: boolean = false;
  articleCommentsActions: ArticleActionsType[] = [];

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private datePipe: DatePipe,
              private authService: AuthService,
              private commentService: CommentService,
              private likeService: LikeService
              ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {


    this.authService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    })

    this.activatedRoute.params.subscribe(params => {
      console.log(params['url'])
      this.articleService.getArticle(params['url'])
        .pipe(
          debounceTime(500)
        )
        .subscribe({
          next: (data: ArticleType | DefaultResponseType) => {
            let error = '';
            if((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
              this._snackBar.open('There was an error trying to get the info about the chosen article, please try later!');
            }
            this.article = data as ArticleType;

            if(this.article && this.article.id) {
              this.likeService.getArticleCommentsActions({articleId: this.article.id})
                .subscribe({
                  next: (data: ArticleActionsType[] | DefaultResponseType) => {
                    this.articleCommentsActions = data as ArticleActionsType[];
                    console.log(this.articleCommentsActions);

                    this.checkCommentsActions()
                  },
                  error: (error: HttpErrorResponse) => {
                    this._snackBar.open(error.error.message);
                  }
                })
            }

            this.commentsCount = this.article.commentsCount as number;

            // checking for load more btn to know how many comments do we have
            if(this.article && (this.commentsCount as number) > 3) {
              this.loadMoreBtnFlag = true;
            } else if((this.commentsCount as number) === 0) {
              this.noCommentsFlag = true;
            }
            this.activeParamsComment.article = this.article.id;

            this.articleService.getRelatedArticles(params['url'])
              .subscribe({
                next: (dataInfo: ArticleType[] | DefaultResponseType) => {
                  if((dataInfo as DefaultResponseType).error !== undefined) {
                    error = (dataInfo as DefaultResponseType).message;
                    this._snackBar.open('There was an error trying to get the related articles, please try later!');
                  }

                  this.relatedArticles = dataInfo as ArticleType[];
                },
                error: (error: HttpErrorResponse) => {
                  this._snackBar.open('There was an error trying to get the related articles, please try later!')
                }
              })
            console.log(this.article)
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open('There was an error trying to get the info about the chosen article, please try later!')
          }
        })
    })



  }

  sendComment(text: string) {
    if((this.article as ArticleType)  && this.article.id) {
      this.commentService.addComment(text, this.article?.id)
        .subscribe({
          next: (data) => {
            if((data as DefaultResponseType).error !== undefined) {
              this._snackBar.open((data as DefaultResponseType).message);
            }
            this.commentInput = '';

            this._snackBar.open(data.message);
            this.getComments(0, 0, true);

          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open(error.error.message)
          }
        })
    }

  }

  applyAction(action: string,  comment: SingleCommentType) {
    if(this.authService.getIsLoggedIn()) {
      this.likeService.applyAction(action, comment.id)
        .subscribe({
          next: (data) => {
            this._snackBar.open(data.message);



            this.likeService.getActionsForComment(comment.id)
              .subscribe((data: DefaultResponseType | ArticleActionsType[]) => {
                let commentActions = data as ArticleActionsType[];

                if(commentActions.length === 0 && action === 'like') {
                  comment.likesCount--;
                  comment.liked = false;
                } else if(commentActions.length === 0 && action === 'dislike') {
                  comment.dislikesCount--;
                  comment.disliked = false;
                }
                else if (comment.id === commentActions[0].comment) {
                  if (commentActions[0].action === 'like') {
                    if(comment.disliked === true) {
                      comment.dislikesCount -= 1;
                    }
                    comment.liked = true;
                    comment.disliked = false;
                    comment.likesCount += 1;

                    if (comment.dislikesCount > 0) {
                      comment.dislikesCount -= 1;
                    }
                  } else if (commentActions[0].action === 'dislike') {
                    if(comment.liked === true) {
                      comment.likesCount -= 1;
                    }
                    comment.disliked = true;
                    comment.liked = false;
                    comment.dislikesCount += 1;

                  }
                }

              })
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open(error.error.message);
          }
        });
    } else {
      this._snackBar.open('Please login or sign up to apply actions')
    }

  }


  loadMoreComments() {
    // Increment the click counter
    this.loadMoreClickTimes++;

    const totalComments = this.commentsCount as number;
    const remainingComments = totalComments - this.offset;
    if (totalComments === 0) {
      this.loadMoreBtnFlag = false;
      return;
    }
    // If there are fewer than or equal to 3 comments initially
    if (totalComments <= 3) {
      this.loadMoreBtnFlag = false;
      return;
    }
    // Checking if the remaining comments are fewer than 10
    if (remainingComments < 10) {
      // Load the remaining comments and hide the "Load More" button
      this.getComments(remainingComments, this.offset);
      this.loadMoreBtnFlag = false;

      console.log('Comments are over');
    } else if (remainingComments > 10) {
      // For the first click, loading the first 10 comments starting from the third
      if (this.loadMoreClickTimes === 1) {
        this.getComments(10, 3);
      } else {
        // For subsequent clicks, updating the offset and load the next batch of 10 comments
        this.offset += 10;
        this.getComments(totalComments - this.offset, this.offset);
        if(totalComments - this.offset < 10) {
          this.loadMoreBtnFlag = false;
        }
      }
    }
  }

  getComments(cycleLength: number, offset: number, addCommentFlag: boolean = false) {
    if(offset) {
      this.activeParamsComment.offset = offset;
    } else if(offset === 0) {
      this.activeParamsComment.offset = 0;
    }
    this.commentService.getComments(this.activeParamsComment)
      .subscribe({
        next: (commentData: DefaultResponseType | CommentType) => {
          if((commentData as DefaultResponseType).error !== undefined) {
            this._snackBar.open((commentData as DefaultResponseType).message)
          }
          this.comments = commentData as CommentType;

          this.commentsCount = this.comments.allCount;

          if(this.article && this.article.comments && !addCommentFlag) {
              //if it is not adding comments then just do the request then push the gotten items to the article.comments
              for (let i = 0; i < cycleLength; i++) {
                this.article.comments.push(this.comments.comments[i]);
              }

              // assuring there are no undefined items in the article.comments

            this.article.comments = this.article.comments?.filter(comment => comment !== undefined);
            console.log(this.article.comments.length);
          } else if(this.article && this.article.comments && addCommentFlag) {
            if(this.article.comments.length <= 3) {
              if(this.commentsCount > 3) {
                //checking if the amount are more then 3 then by adding the new comment the loadMoreBtn appears
                this.loadMoreBtnFlag = true;
              }
              this.article.comments = [];
              this.article.comments.push(...this.comments.comments.slice(0, 3));
              // this.loadMoreBtnFlag = true;

            } else if(this.commentsCount > this.article.comments.length)  {
              console.log(this.comments);
              this.article.comments.unshift(...this.comments.comments.slice(0, 1));
              this.article.comments.pop();
              this.loadMoreBtnFlag = true;
            } else  {
              this.article.comments.unshift(...this.comments.comments.slice(0, 1));
            }
          }

          // checking if the new comments are liked or disliked by the current user
          this.checkCommentsActions();

        }
      })
  }

  checkCommentsActions() {
    this.articleCommentsActions.forEach(commentAction => {

      (this.article.comments as SingleCommentType[]).forEach(comment => {

        if(comment.id === commentAction.comment && commentAction.action === 'like') {
          comment.liked = true;
          comment.disliked = false;
        } else if (comment.id === commentAction.comment && commentAction.action === 'dislike') {
          comment.disliked = true;
          comment.liked = false;
        }
      });

    })

  }
}
