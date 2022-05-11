import { NgModule } from '@angular/core';
import { ExpireSessionServiceModule } from './../expire-session/expire-session-service.module';

@NgModule({
  imports: [ExpireSessionServiceModule],
})
export class AuthenticationServiceModule {}
