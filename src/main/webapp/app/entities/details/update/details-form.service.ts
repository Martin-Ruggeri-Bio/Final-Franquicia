import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDetails, NewDetails } from '../details.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDetails for edit and NewDetailsFormGroupInput for create.
 */
type DetailsFormGroupInput = IDetails | PartialWithRequiredKeyOf<NewDetails>;

type DetailsFormDefaults = Pick<NewDetails, 'id'>;

type DetailsFormGroupContent = {
  id: FormControl<IDetails['id'] | NewDetails['id']>;
  amount: FormControl<IDetails['amount']>;
  menu: FormControl<IDetails['menu']>;
  sale: FormControl<IDetails['sale']>;
};

export type DetailsFormGroup = FormGroup<DetailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DetailsFormService {
  createDetailsFormGroup(details: DetailsFormGroupInput = { id: null }): DetailsFormGroup {
    const detailsRawValue = {
      ...this.getFormDefaults(),
      ...details,
    };
    return new FormGroup<DetailsFormGroupContent>({
      id: new FormControl(
        { value: detailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      amount: new FormControl(detailsRawValue.amount),
      menu: new FormControl(detailsRawValue.menu),
      sale: new FormControl(detailsRawValue.sale),
    });
  }

  getDetails(form: DetailsFormGroup): IDetails | NewDetails {
    return form.getRawValue() as IDetails | NewDetails;
  }

  resetForm(form: DetailsFormGroup, details: DetailsFormGroupInput): void {
    const detailsRawValue = { ...this.getFormDefaults(), ...details };
    form.reset(
      {
        ...detailsRawValue,
        id: { value: detailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DetailsFormDefaults {
    return {
      id: null,
    };
  }
}
