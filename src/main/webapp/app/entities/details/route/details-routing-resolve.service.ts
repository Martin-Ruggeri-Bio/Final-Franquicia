import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDetails } from '../details.model';
import { DetailsService } from '../service/details.service';

@Injectable({ providedIn: 'root' })
export class DetailsRoutingResolveService implements Resolve<IDetails | null> {
  constructor(protected service: DetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDetails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((details: HttpResponse<IDetails>) => {
          if (details.body) {
            return of(details.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
