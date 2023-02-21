import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDetails } from '../details.model';

@Component({
  selector: 'jhi-details-detail',
  templateUrl: './details-detail.component.html',
})
export class DetailsDetailComponent implements OnInit {
  details: IDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ details }) => {
      this.details = details;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
