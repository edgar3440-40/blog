import { Component, OnInit } from '@angular/core';
import {debounceTime} from "rxjs";
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
import {CommentType} from "../../../../types/comment.type";


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

  loadMoreBtnFlag: boolean = false;

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

            // checking for load more btn to knmow how many comments do we havw
            if(this.article && (this.article.commentsCount as number) > 3) {
              this.loadMoreBtnFlag = true;
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
            this.commentService.getComments(this.activeParamsComment)
              .subscribe({
                next: (commentData: DefaultResponseType | CommentType) => {
                  if((commentData as DefaultResponseType).error !== undefined) {
                    this._snackBar.open((commentData as DefaultResponseType).message)
                  }
                  this.comments = commentData as CommentType;
                  if(this.article && this.article.comments) {
                    this.article.comments = [];

                    for (let i = 0; i < 3; i++) {
                      this.article.comments.push(this.comments.comments[i]);
                    }
                  }

                }
              })
          },
          error: (error: HttpErrorResponse) => {
            this._snackBar.open(error.error.message)
          }
        })
    }

  }

  applyAction(action: string) {
    this.likeService.applyAction(action)
      .subscribe({
        next: (data) => {
          let error = '';
          if((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
            this._snackBar.open('Error please try again!');
          }
        }
      })
  }

  loadMoreComments() {
    this.activeParamsComment.offset = 3;
    this.commentService.getComments(this.activeParamsComment)
      .subscribe({
        next: (data) => {

        }
      })
  }

  getComments() {

  }
}
