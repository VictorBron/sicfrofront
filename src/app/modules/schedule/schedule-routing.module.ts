import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './schedule.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
