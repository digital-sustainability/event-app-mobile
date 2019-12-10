import { TestBed } from '@angular/core/testing';

import { UserFeedbackService } from './user-feedback.service';

describe('UserFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserFeedbackService = TestBed.get(UserFeedbackService);
    expect(service).toBeTruthy();
  });
});
