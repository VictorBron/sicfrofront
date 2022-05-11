import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonDialogConfig, ModalDialogComponent } from '../../components/modal';
import { ModalActionType } from '../../models';

export const dialogSuccess = (dialog: MatDialog): MatDialogRef<ModalDialogComponent, any> => {
  return dialog.open(
    ModalDialogComponent,
    new CommonDialogConfig({
      type: ModalActionType.Accept,
      textTitle: 'MODAL.TITLE.ACTION_SUCCESS',
      textMessage: '',
      showQueryResult: 1,
      iconMessage1: 'MODAL.MESSAGE.SUCCESS',
      iconMessage2: '',
      confirmText: 'MODAL.MESSAGE.BACK_LIST',
    }),
  );
};
