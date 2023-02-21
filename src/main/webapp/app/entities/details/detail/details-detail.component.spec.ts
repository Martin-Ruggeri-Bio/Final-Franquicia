import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailsDetailComponent } from './details-detail.component';

describe('Details Management Detail Component', () => {
  let comp: DetailsDetailComponent;
  let fixture: ComponentFixture<DetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ details: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load details on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.details).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
