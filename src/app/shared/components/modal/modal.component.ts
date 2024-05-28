import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormControl} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dialog, DIALOG_DATA} from "@angular/cdk/dialog";
import {ModalDataType} from "../../../../types/modal-data.type";

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

   articleCategory!: string;

  categories = ['Создание сайтов', 'Продвижение', 'Реклама', 'Копирайтинг'];
  categoriesSelect!: string[];

  requestForm = this.fb.group({
    category: [''],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
  })

  requestSuccessFlag: boolean = false;

  isConsultation: boolean = false;


  constructor(private requestService: RequestService ,private fb: FormBuilder,
              private _snackBar: MatSnackBar, private dialog: Dialog, @Inject(DIALOG_DATA) private data: ModalDataType ) { }

  ngOnInit(): void {
    if(this.data.category) {
      this.articleCategory = this.data.category;
    }
    if(this.data.isConsultation) {
      this.isConsultation = this.data.isConsultation;
    }

    this.categoriesSelect = this.categories.filter(category => category !== this.articleCategory)

    this.requestForm.get('category')?.patchValue(this.articleCategory);

    this.requestForm.addControl('category', new FormControl(this.articleCategory, Validators.required))
  }

  closePopup() {
    this.dialog.closeAll();
  }

  doRequest() {
    // the func where we send the request of consultation to the back. We use the requestService.
    if(this.requestForm.value.category && this.requestForm.value.name && this.requestForm.value.phone) {
      this.requestService.doRequest(this.requestForm.value.name, this.requestForm.value.phone, 'order', this.requestForm.value.category)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if((data as DefaultResponseType).error ) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.requestSuccessFlag = true;
            this.requestForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            if(error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Error during sending the request, please try later. Thank you!!!');
            }
          }
        })

    } else if( this.requestForm.value.name && this.requestForm.value.phone) {
      this.requestService.doRequest(this.requestForm.value.name, this.requestForm.value.phone, 'consultation')
        .subscribe({
          next: (data: DefaultResponseType) => {
            if((data as DefaultResponseType).error ) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.requestSuccessFlag = true;
            this.requestForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            if(error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Error during sending the request, please try later. Thank you!!!');
            }
          }
        })

    }
  }

}
