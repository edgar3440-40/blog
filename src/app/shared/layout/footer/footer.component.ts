import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  modalOpen: boolean = false;

  requestSuccessFlag: boolean = false;

  requestForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
  })

  constructor(private fb: FormBuilder, private requestService: RequestService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  togglePopup(afterSuccess?: boolean) {
    if(afterSuccess) {
      this.requestSuccessFlag = false;
    }
    this.modalOpen = !this.modalOpen;
  }

  doRequest() {
    // the func where we send the request of consultation to the back. We use the requestService.
    if( this.requestForm.value.name && this.requestForm.value.phone) {
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
