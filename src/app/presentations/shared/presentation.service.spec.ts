import { TestBed } from '@angular/core/testing';

import { PresentationService } from './presentation.service';

describe('PresentationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PresentationService = TestBed.get(PresentationService);
    expect(service).toBeTruthy();
  });
});
