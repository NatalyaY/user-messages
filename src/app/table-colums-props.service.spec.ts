import { TestBed } from '@angular/core/testing';

import { TableColumsPropsService } from './table-colums-props.service';

describe('TableColumsPropsService', () => {
  let service: TableColumsPropsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableColumsPropsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
