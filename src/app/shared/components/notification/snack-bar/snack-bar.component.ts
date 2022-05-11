import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SNACK_CLASS } from '../../../constants';
import { SnackModelEmitter } from '../../../models';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent {
  private _snackDuration = 3 * 1000;
  private _horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private _verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {
    /*EMPTY BLOCK*/
  }

  openSnackBar(data: SnackModelEmitter) {
    this.snackBar.open(this.translate.instant(data.message), data.action ? this.translate.instant(data.action) : '', {
      duration: this._snackDuration,
      horizontalPosition: this._horizontalPosition,
      verticalPosition: this._verticalPosition,
      panelClass: [data.class ? data.class : SNACK_CLASS.DEFAULT],
    });
  }
}
