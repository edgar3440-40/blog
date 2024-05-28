import {Component, OnInit, ElementRef, HostListener, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import { RequestService } from 'src/app/shared/services/request.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Dialog} from "@angular/cdk/dialog";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {ModalDataType} from "../../../types/modal-data.type";
@Component({
  selector: 'app-main-detail',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  stagePadding = (1200 - window.innerWidth) / 2;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,

    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    stagePadding: this.stagePadding
  }
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  };
  reviews = [
    {
      name: 'Станислав',
      img: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      img: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть. '
    },
    {
      name: 'Мария',
      img: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс! '
    },
    {
      name: 'Ирина',
      img: 'Review-4-min.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию. '
    },
    {
      name: 'Яника',
      img: 'Review-5-min.jpg',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья? '
    },
    {
      name: 'Марина',
      img: 'Review-6-min.jpg',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента! '
    },
    {
      name: 'Станислав',
      img: 'Review-7-min.jpg',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь! '
    },
  ];

  public services = [
    {
      image: '/assets/images/main-section-2/section-2-img-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500
    },
    {
      image: '/assets/images/main-section-2/section-2-img-2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500
    },
    {
      image: '/assets/images/main-section-2/section-2-img-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000
    },
    {
      image: '/assets/images/main-section-2/section-2-img-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750
    },
  ]



  // The variable where we asign the articles got from the back
  articles: ArticleType[] = [];




  // the variable where we get the articles category to fill the form of request emitted from the article-component
  constructor(
    private articleService: ArticleService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private requestService: RequestService,
    private dialog: Dialog
    ) {


  }

  ngOnInit(): void {


    // getting the popular articles
    this.articleService.getPopularArticles()
      .subscribe({
        next: (data: ArticleType[] | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.articles = data as ArticleType[];
        }
      })
  }

  togglePopup() {
    this.dialog.open(ModalComponent)
  }

  setArticleCategory(value: string) {
    const data : ModalDataType = {category: value, isConsultation: false}
    this.dialog.open(ModalComponent, {data})
  }

}
