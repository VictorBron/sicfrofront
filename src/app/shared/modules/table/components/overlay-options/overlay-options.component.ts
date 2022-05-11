import { Component, Input } from '@angular/core';
import { CommonObject } from '../../../../models';
import { OverlayOption } from '../../models';

@Component({
  selector: 'app-overlay-options',
  templateUrl: './overlay-options.component.html',
  styleUrls: ['./overlay-options.component.scss'],
})
export class OverlayOptionsComponent {
  @Input() options: OverlayOption[] = [];
  @Input() element: CommonObject;
  public allOptionsDisabled: boolean = false;
  public isOpen = false;

  public isDisabled(option: OverlayOption, element: CommonObject): boolean {
    return option.disable?.(element);
  }

  public getText(): string {
    if (this.someEnabled()) return '...';
    this.allOptionsDisabled = true;
    return '';
  }

  public someEnabled(): boolean {
    let almostOneEnabled: boolean = false;
    this.options.forEach(option => {
      if (!option.disable?.(this.element)) {
        almostOneEnabled = true;
        return;
      }
    });
    return almostOneEnabled;
  }

  public onOptionClicked(option: OverlayOption, element: CommonObject): void {
    option.fn(element);
    this.open();
  }

  public open(): void {
    this.isOpen = !this.isOpen;
  }
}
