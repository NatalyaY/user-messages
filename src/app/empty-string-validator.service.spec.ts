import { TestBed } from '@angular/core/testing';

import { EmptyStringValidatorService } from './empty-string-validator.service';

describe('EmptyStringValidatorService', () => {
  let service: EmptyStringValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmptyStringValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
