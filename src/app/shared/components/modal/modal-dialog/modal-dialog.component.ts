import { TranslateService } from '@ngx-translate/core';
import { Component, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDialogResult } from './../../../models/modal/modal-dialog-result';
import { ModalModelEmitter } from './../../../models/modal/modal-model-emitter';
import { ModalResponse } from '../../../models/modal/modal-response';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
})
// implements OnInit
export class ModalDialogComponent {
  public type: number;
  public title: string;
  public message: string;
  public textInformative: string;
  public showQueryResult: number = null;
  public iconMessage1: string;
  public iconMessage2: string;
  public confirmText: string;
  // public TOOLTIPS = TOOLTIPS;

  constructor(
    public dialogRef: MatDialogRef<ModalModelEmitter>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: ModalModelEmitter,
  ) {
    this.type = data.type;
    this.title = data.textTitle;
    this.message = data.textMessage;
    this.showQueryResult = data.showQueryResult;
    this.iconMessage1 = data.iconMessage1;
    this.iconMessage2 = data.iconMessage2;
    this.confirmText = data.confirmText;
  }

  onYesClick() {
    this.dialogRef.close(<ModalDialogResult>{
      buttonId: ModalResponse.Ok,
    });
  }

  onNoClick() {
    this.dialogRef.close(<ModalDialogResult>{
      buttonId: ModalResponse.No,
    });
  }

  onCancelClick() {
    this.dialogRef.close(<ModalDialogResult>{
      buttonId: ModalResponse.Cancel,
    });
  }
}

export class CommonDialogConfig extends MatDialogConfig<ModalModelEmitter> {
  constructor(data: ModalModelEmitter) {
    super();

    this.minWidth = '300px';
    this.maxWidth = 'calc(100% - 20px)';
    this.maxHeight = '80%';

    this.data = data;
  }
}
