import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dialog} from "@angular/cdk/dialog";
import {ModalComponent} from "../../components/modal/modal.component";
import {ModalDataType} from "../../../../types/modal-data.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  modalOpen: boolean = false;

  requestSuccessFlag: boolean = false;



  constructor(private fb: FormBuilder, private requestService: RequestService, private _snackBar: MatSnackBar,
              private dialog: Dialog) { }

  ngOnInit(): void {
  }

  togglePopup() {

    const data : ModalDataType = {isConsultation: true}
    this.dialog.open(ModalComponent, {data});

  }

}
