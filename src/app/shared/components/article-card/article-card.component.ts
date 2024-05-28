import {Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: ArticleType;
  @Input() usual!: boolean;
  @Output() modal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() articleTitle: EventEmitter<string> = new EventEmitter<string>();

  category: string = '';
  modalCalled: boolean = false;
  modalIsCalled(category: string) {
    this.category = category;
    this.articleTitle.emit(this.category);
    // this.modal.emit(this.modalCalled);
  }

  isOnMain: boolean = true;
  serverStaticPath = environment.serverStaticPath;
  constructor() {
  }



  ngOnInit(): void {
  }

}
