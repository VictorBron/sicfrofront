import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './log-in.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogInRoutingModule {}
