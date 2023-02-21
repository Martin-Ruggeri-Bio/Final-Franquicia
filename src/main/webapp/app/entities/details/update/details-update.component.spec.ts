import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DetailsFormService } from './details-form.service';
import { DetailsService } from '../service/details.service';
import { IDetails } from '../details.model';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { ISale } from 'app/entities/sale/sale.model';
import { SaleService } from 'app/entities/sale/service/sale.service';

import { DetailsUpdateComponent } from './details-update.component';

describe('Details Management Update Component', () => {
  let comp: DetailsUpdateComponent;
  let fixture: ComponentFixture<DetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let detailsFormService: DetailsFormService;
  let detailsService: DetailsService;
  let menuService: MenuService;
  let saleService: SaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DetailsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    detailsFormService = TestBed.inject(DetailsFormService);
    detailsService = TestBed.inject(DetailsService);
    menuService = TestBed.inject(MenuService);
    saleService = TestBed.inject(SaleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Menu query and add missing value', () => {
      const details: IDetails = { id: 456 };
      const menu: IMenu = { id: 95586 };
      details.menu = menu;

      const menuCollection: IMenu[] = [{ id: 58769 }];
      jest.spyOn(menuService, 'query').mockReturnValue(of(new HttpResponse({ body: menuCollection })));
      const additionalMenus = [menu];
      const expectedCollection: IMenu[] = [...additionalMenus, ...menuCollection];
      jest.spyOn(menuService, 'addMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ details });
      comp.ngOnInit();

      expect(menuService.query).toHaveBeenCalled();
      expect(menuService.addMenuToCollectionIfMissing).toHaveBeenCalledWith(
        menuCollection,
        ...additionalMenus.map(expect.objectContaining)
      );
      expect(comp.menusSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sale query and add missing value', () => {
      const details: IDetails = { id: 456 };
      const sale: ISale = { id: 90899 };
      details.sale = sale;

      const saleCollection: ISale[] = [{ id: 11826 }];
      jest.spyOn(saleService, 'query').mockReturnValue(of(new HttpResponse({ body: saleCollection })));
      const additionalSales = [sale];
      const expectedCollection: ISale[] = [...additionalSales, ...saleCollection];
      jest.spyOn(saleService, 'addSaleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ details });
      comp.ngOnInit();

      expect(saleService.query).toHaveBeenCalled();
      expect(saleService.addSaleToCollectionIfMissing).toHaveBeenCalledWith(
        saleCollection,
        ...additionalSales.map(expect.objectContaining)
      );
      expect(comp.salesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const details: IDetails = { id: 456 };
      const menu: IMenu = { id: 26578 };
      details.menu = menu;
      const sale: ISale = { id: 99594 };
      details.sale = sale;

      activatedRoute.data = of({ details });
      comp.ngOnInit();

      expect(comp.menusSharedCollection).toContain(menu);
      expect(comp.salesSharedCollection).toContain(sale);
      expect(comp.details).toEqual(details);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetails>>();
      const details = { id: 123 };
      jest.spyOn(detailsFormService, 'getDetails').mockReturnValue(details);
      jest.spyOn(detailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ details });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: details }));
      saveSubject.complete();

      // THEN
      expect(detailsFormService.getDetails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(detailsService.update).toHaveBeenCalledWith(expect.objectContaining(details));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetails>>();
      const details = { id: 123 };
      jest.spyOn(detailsFormService, 'getDetails').mockReturnValue({ id: null });
      jest.spyOn(detailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ details: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: details }));
      saveSubject.complete();

      // THEN
      expect(detailsFormService.getDetails).toHaveBeenCalled();
      expect(detailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDetails>>();
      const details = { id: 123 };
      jest.spyOn(detailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ details });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(detailsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMenu', () => {
      it('Should forward to menuService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(menuService, 'compareMenu');
        comp.compareMenu(entity, entity2);
        expect(menuService.compareMenu).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSale', () => {
      it('Should forward to saleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(saleService, 'compareSale');
        comp.compareSale(entity, entity2);
        expect(saleService.compareSale).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
