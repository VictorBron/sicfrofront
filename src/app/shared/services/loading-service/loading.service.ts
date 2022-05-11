import { Injectable } from '@angular/core';
import { BehaviorSubject, PartialObserver, Subscription } from 'rxjs';
import { LoadingServiceModule } from './loading-service.module';

export interface ILoadingConfig {
  show: boolean;
  animate: boolean;
}
@Injectable({
  providedIn: LoadingServiceModule,
})
export class LoadingService {
  private shownLoading = 0;
  private readonly loadingObs: BehaviorSubject<ILoadingConfig>;

  private shownLoadingScreen = false;
  private readonly loadingScreenObs: BehaviorSubject<ILoadingConfig>;

  constructor() {
    // Define observable with default loading config.
    this.loadingObs = new BehaviorSubject<ILoadingConfig>(<ILoadingConfig>{
      show: false,
      animate: true,
    });
    this.loadingScreenObs = new BehaviorSubject<ILoadingConfig>(<ILoadingConfig>{
      show: false,
      animate: true,
    });
  }

  //#region Loading events.

  subscribeLoading(observer: PartialObserver<ILoadingConfig>): Subscription {
    return this.loadingObs.subscribe(observer);
  }

  showLoading(animate: boolean = true) {
    if (this.shownLoading) {
      return;
    }

    this.shownLoading++;

    this.loadingObs.next(<ILoadingConfig>{
      show: true,
      animate: animate,
    });
  }

  hideLoading(animate: boolean = true) {
    if (!this.shownLoading) {
      return;
    }

    if (this.shownLoading) this.shownLoading--;

    if (!this.shownLoading) {
      this.loadingObs.next(<ILoadingConfig>{
        show: false,
        animate: animate,
      });
    }
  }

  //#endregion

  //#region Screen Loading Events

  subscribeLoadingScreen(observer: PartialObserver<ILoadingConfig>): Subscription {
    return this.loadingScreenObs.subscribe(observer);
  }

  showLoadingScreen(animate: boolean = true) {
    if (this.shownLoadingScreen) {
      return;
    }

    this.shownLoadingScreen = true;

    this.loadingScreenObs.next(<ILoadingConfig>{
      show: true,
      animate: animate,
    });
  }

  hideLoadingScreen(animate: boolean = true) {
    if (!this.shownLoadingScreen) {
      return;
    }

    this.shownLoadingScreen = false;

    this.loadingScreenObs.next(<ILoadingConfig>{
      show: false,
      animate: animate,
    });
  }

  //#endregion
}
