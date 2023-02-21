import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShoppingCartFormService } from './shopping-cart-form.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { IShoppingCart } from '../shopping-cart.model';
import { IMenu } from 'app/entities/menu/menu.model';
import { MenuService } from 'app/entities/menu/service/menu.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

import { ShoppingCartUpdateComponent } from './shopping-cart-update.component';

describe('ShoppingCart Management Update Component', () => {
  let comp: ShoppingCartUpdateComponent;
  let fixture: ComponentFixture<ShoppingCartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shoppingCartFormService: ShoppingCartFormService;
  let shoppingCartService: ShoppingCartService;
  let menuService: MenuService;
  let clientService: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShoppingCartUpdateComponent],
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
      .overrideTemplate(ShoppingCartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shoppingCartFormService = TestBed.inject(ShoppingCartFormService);
    shoppingCartService = TestBed.inject(ShoppingCartService);
    menuService = TestBed.inject(MenuService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Menu query and add missing value', () => {
      const shoppingCart: IShoppingCart = { id: 456 };
      const menu: IMenu = { id: 73055 };
      shoppingCart.menu = menu;

      const menuCollection: IMenu[] = [{ id: 30380 }];
      jest.spyOn(menuService, 'query').mockReturnValue(of(new HttpResponse({ body: menuCollection })));
      const additionalMenus = [menu];
      const expectedCollection: IMenu[] = [...additionalMenus, ...menuCollection];
      jest.spyOn(menuService, 'addMenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shoppingCart });
      comp.ngOnInit();

      expect(menuService.query).toHaveBeenCalled();
      expect(menuService.addMenuToCollectionIfMissing).toHaveBeenCalledWith(
        menuCollection,
        ...additionalMenus.map(expect.objectContaining)
      );
      expect(comp.menusSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Client query and add missing value', () => {
      const shoppingCart: IShoppingCart = { id: 456 };
      const client: IClient = { id: 19805 };
      shoppingCart.client = client;

      const clientCollection: IClient[] = [{ id: 5425 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shoppingCart });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining)
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shoppingCart: IShoppingCart = { id: 456 };
      const menu: IMenu = { id: 27908 };
      shoppingCart.menu = menu;
      const client: IClient = { id: 98947 };
      shoppingCart.client = client;

      activatedRoute.data = of({ shoppingCart });
      comp.ngOnInit();

      expect(comp.menusSharedCollection).toContain(menu);
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.shoppingCart).toEqual(shoppingCart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShoppingCart>>();
      const shoppingCart = { id: 123 };
      jest.spyOn(shoppingCartFormService, 'getShoppingCart').mockReturnValue(shoppingCart);
      jest.spyOn(shoppingCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shoppingCart }));
      saveSubject.complete();

      // THEN
      expect(shoppingCartFormService.getShoppingCart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shoppingCartService.update).toHaveBeenCalledWith(expect.objectContaining(shoppingCart));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShoppingCart>>();
      const shoppingCart = { id: 123 };
      jest.spyOn(shoppingCartFormService, 'getShoppingCart').mockReturnValue({ id: null });
      jest.spyOn(shoppingCartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingCart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shoppingCart }));
      saveSubject.complete();

      // THEN
      expect(shoppingCartFormService.getShoppingCart).toHaveBeenCalled();
      expect(shoppingCartService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShoppingCart>>();
      const shoppingCart = { id: 123 };
      jest.spyOn(shoppingCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shoppingCartService.update).toHaveBeenCalled();
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

    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
