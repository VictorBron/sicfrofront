import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogConfig, ModalDialogComponent } from '../../components/modal';
import { ModalActionType } from './../../models/modal/modal-action-type';

export const openDialog = (
  dialog: MatDialog,
  type: ModalActionType,
  textTitle: string,
  textMessage: string,
  showQueryResult: number = null,
  iconMessage1: string = '',
  iconMessage2: string = '',
  confirmText: string = '',
): MatDialogRef<ModalDialogComponent, any> => {
  return dialog.open(
    ModalDialogComponent,
    new CommonDialogConfig({
      type,
      textTitle,
      textMessage,
      showQueryResult,
      iconMessage1,
      iconMessage2,
      confirmText,
    }),
  );
};
