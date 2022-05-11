import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait-spinner',
  templateUrl: './wait-spinner.component.html',
  styleUrls: ['./wait-spinner.component.scss'],
})
export class WaitSpinnerComponent implements OnInit {
  @Input() loading = false;
  @Input() showBackdrop = true;
  @Input() colorMaterial = 'accent';

  constructor() {}

  ngOnInit(): void {
    return;
  }
}
