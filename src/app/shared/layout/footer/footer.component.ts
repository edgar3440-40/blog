import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dialog} from "@angular/cdk/dialog";
import {ModalComponent} from "../../components/modal/modal.component";

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

  constructor(private fb: FormBuilder, private requestService: RequestService, private _snackBar: MatSnackBar,
              private dialog: Dialog) { }

  ngOnInit(): void {
  }

  togglePopup(afterSuccess?: boolean) {
    this.dialog.open(ModalComponent);
    this.requestService.setIsConsultation(true);
  }

  doRequest() {
    // the func where we send the request of consultation to the back. We use the requestService.

  }
}
