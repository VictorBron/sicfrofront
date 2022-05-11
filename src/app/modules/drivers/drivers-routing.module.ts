import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './drivers.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
