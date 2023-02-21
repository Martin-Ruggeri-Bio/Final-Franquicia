import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDetails, NewDetails } from '../details.model';

export type PartialUpdateDetails = Partial<IDetails> & Pick<IDetails, 'id'>;

export type EntityResponseType = HttpResponse<IDetails>;
export type EntityArrayResponseType = HttpResponse<IDetails[]>;

@Injectable({ providedIn: 'root' })
export class DetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(details: NewDetails): Observable<EntityResponseType> {
    return this.http.post<IDetails>(this.resourceUrl, details, { observe: 'response' });
  }

  update(details: IDetails): Observable<EntityResponseType> {
    return this.http.put<IDetails>(`${this.resourceUrl}/${this.getDetailsIdentifier(details)}`, details, { observe: 'response' });
  }

  partialUpdate(details: PartialUpdateDetails): Observable<EntityResponseType> {
    return this.http.patch<IDetails>(`${this.resourceUrl}/${this.getDetailsIdentifier(details)}`, details, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDetailsIdentifier(details: Pick<IDetails, 'id'>): number {
    return details.id;
  }

  compareDetails(o1: Pick<IDetails, 'id'> | null, o2: Pick<IDetails, 'id'> | null): boolean {
    return o1 && o2 ? this.getDetailsIdentifier(o1) === this.getDetailsIdentifier(o2) : o1 === o2;
  }

  addDetailsToCollectionIfMissing<Type extends Pick<IDetails, 'id'>>(
    detailsCollection: Type[],
    ...detailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const details: Type[] = detailsToCheck.filter(isPresent);
    if (details.length > 0) {
      const detailsCollectionIdentifiers = detailsCollection.map(detailsItem => this.getDetailsIdentifier(detailsItem)!);
      const detailsToAdd = details.filter(detailsItem => {
        const detailsIdentifier = this.getDetailsIdentifier(detailsItem);
        if (detailsCollectionIdentifiers.includes(detailsIdentifier)) {
          return false;
        }
        detailsCollectionIdentifiers.push(detailsIdentifier);
        return true;
      });
      return [...detailsToAdd, ...detailsCollection];
    }
    return detailsCollection;
  }
}
