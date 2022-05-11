import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observer, Subscription } from 'rxjs';
import { ILoadingConfig, LoadingService } from '../../services/loading-service/loading.service';

@Component({
  selector: 'app-general-loading',
  templateUrl: './general-loading.component.html',
  styleUrls: ['./general-loading.component.scss'],
})
export class GeneralLoadingComponent implements OnInit, OnDestroy {
  show: boolean;

  private loadingSubscription: Subscription;
  private readonly loadingObserver: Observer<ILoadingConfig> = <Observer<ILoadingConfig>>{
    next: loadingConfig => this.handleLoadingConfig(loadingConfig),
  };

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingSubscription = this.loadingService.subscribeLoading(this.loadingObserver);
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  private handleLoadingConfig(loadingConfig: ILoadingConfig) {
    if (loadingConfig) {
      this.show = loadingConfig.show;
    } else {
      this.show = false;
    }
  }
}
