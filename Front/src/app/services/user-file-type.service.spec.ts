import { TestBed } from '@angular/core/testing';

import { UserFileTypeService } from './user-file-type.service';

describe('UserFileTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserFileTypeService = TestBed.get(UserFileTypeService);
    expect(service).toBeTruthy();
  });
});
