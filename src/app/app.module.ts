import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/interceptors/token-interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AuthGuard, LoginGuard } from './shared/guards';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';
import { NavBarComponent } from './shared/components';
import { UserSettingsComponent } from './shared/components/nav-bar/components/user-settings';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthenticationServiceModule, LoadingServiceModule, PermissionServiceModule } from './shared/services';
import { NotificationModule } from './shared/components/notification/notification.module';
import { generateRandomQueryId } from './shared/utils/generateRandomQueryId/generate-random-query-id.util';
import { EnvironmentService } from './shared/services/environment/environment.service';
import { ExpireSessionModule } from './shared/components/expire-session/expire-session.module';

/* AoT requires an exported function for factories */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', generateRandomQueryId('.json'));
}

/* Load config */
export function initConfig(config: EnvironmentService) {
  return () => config.loadConfig();
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', generateRandomQueryId('.json'));
}
@NgModule({
  declarations: [AppComponent, UserSettingsComponent, NavBarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    HttpClientModule,
    ScheduleModule,
    SharedModule,
    OverlayModule,
    AppRoutingModule,
    NotificationModule,
    PermissionServiceModule,
    ExpireSessionModule,
    LoadingServiceModule,
    AuthenticationServiceModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [EnvironmentService],
      multi: true,
    },
    AuthGuard,
    LoginGuard,
    EnvironmentService,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
