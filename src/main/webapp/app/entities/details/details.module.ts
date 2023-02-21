import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DetailsComponent } from './list/details.component';
import { DetailsDetailComponent } from './detail/details-detail.component';
import { DetailsUpdateComponent } from './update/details-update.component';
import { DetailsDeleteDialogComponent } from './delete/details-delete-dialog.component';
import { DetailsRoutingModule } from './route/details-routing.module';

@NgModule({
  imports: [SharedModule, DetailsRoutingModule],
  declarations: [DetailsComponent, DetailsDetailComponent, DetailsUpdateComponent, DetailsDeleteDialogComponent],
})
export class DetailsModule {}
