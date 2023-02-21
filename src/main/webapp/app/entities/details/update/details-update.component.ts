import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DetailsFormService, DetailsFormGroup } from './details-form.service';
import { IDetails } from '../details.model';
import { DetailsService } from '../service/details.service';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { ISale } from 'app/entities/sale/sale.model';
import { SaleService } from 'app/entities/sale/service/sale.service';

@Component({
  selector: 'jhi-details-update',
  templateUrl: './details-update.component.html',
})
export class DetailsUpdateComponent implements OnInit {
  isSaving = false;
  details: IDetails | null = null;

  menusSharedCollection: IMenu[] = [];
  salesSharedCollection: ISale[] = [];

  editForm: DetailsFormGroup = this.detailsFormService.createDetailsFormGroup();

  constructor(
    protected detailsService: DetailsService,
    protected detailsFormService: DetailsFormService,
    protected menuService: MenuService,
    protected saleService: SaleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMenu = (o1: IMenu | null, o2: IMenu | null): boolean => this.menuService.compareMenu(o1, o2);

  compareSale = (o1: ISale | null, o2: ISale | null): boolean => this.saleService.compareSale(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ details }) => {
      this.details = details;
      if (details) {
        this.updateForm(details);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const details = this.detailsFormService.getDetails(this.editForm);
    if (details.id !== null) {
      this.subscribeToSaveResponse(this.detailsService.update(details));
    } else {
      this.subscribeToSaveResponse(this.detailsService.create(details));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(details: IDetails): void {
    this.details = details;
    this.detailsFormService.resetForm(this.editForm, details);

    this.menusSharedCollection = this.menuService.addMenuToCollectionIfMissing<IMenu>(this.menusSharedCollection, details.menu);
    this.salesSharedCollection = this.saleService.addSaleToCollectionIfMissing<ISale>(this.salesSharedCollection, details.sale);
  }

  protected loadRelationshipsOptions(): void {
    this.menuService
      .query()
      .pipe(map((res: HttpResponse<IMenu[]>) => res.body ?? []))
      .pipe(map((menus: IMenu[]) => this.menuService.addMenuToCollectionIfMissing<IMenu>(menus, this.details?.menu)))
      .subscribe((menus: IMenu[]) => (this.menusSharedCollection = menus));

    this.saleService
      .query()
      .pipe(map((res: HttpResponse<ISale[]>) => res.body ?? []))
      .pipe(map((sales: ISale[]) => this.saleService.addSaleToCollectionIfMissing<ISale>(sales, this.details?.sale)))
      .subscribe((sales: ISale[]) => (this.salesSharedCollection = sales));
  }
}
