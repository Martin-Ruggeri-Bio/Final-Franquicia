import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DetailsComponent } from '../list/details.component';
import { DetailsDetailComponent } from '../detail/details-detail.component';
import { DetailsUpdateComponent } from '../update/details-update.component';
import { DetailsRoutingResolveService } from './details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const detailsRoute: Routes = [
  {
    path: '',
    component: DetailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DetailsDetailComponent,
    resolve: {
      details: DetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DetailsUpdateComponent,
    resolve: {
      details: DetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DetailsUpdateComponent,
    resolve: {
      details: DetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(detailsRoute)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
