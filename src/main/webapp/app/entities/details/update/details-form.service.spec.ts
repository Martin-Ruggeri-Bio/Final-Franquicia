import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../details.test-samples';

import { DetailsFormService } from './details-form.service';

describe('Details Form Service', () => {
  let service: DetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsFormService);
  });

  describe('Service methods', () => {
    describe('createDetailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDetailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            menu: expect.any(Object),
            sale: expect.any(Object),
          })
        );
      });

      it('passing IDetails should create a new form with FormGroup', () => {
        const formGroup = service.createDetailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            amount: expect.any(Object),
            menu: expect.any(Object),
            sale: expect.any(Object),
          })
        );
      });
    });

    describe('getDetails', () => {
      it('should return NewDetails for default Details initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDetailsFormGroup(sampleWithNewData);

        const details = service.getDetails(formGroup) as any;

        expect(details).toMatchObject(sampleWithNewData);
      });

      it('should return NewDetails for empty Details initial value', () => {
        const formGroup = service.createDetailsFormGroup();

        const details = service.getDetails(formGroup) as any;

        expect(details).toMatchObject({});
      });

      it('should return IDetails', () => {
        const formGroup = service.createDetailsFormGroup(sampleWithRequiredData);

        const details = service.getDetails(formGroup) as any;

        expect(details).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDetails should not enable id FormControl', () => {
        const formGroup = service.createDetailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDetails should disable id FormControl', () => {
        const formGroup = service.createDetailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
