import { TestBed, async, inject } from '@angular/core/testing';

import { IsNoAuthGuard } from './is-no-auth.guard';

describe('IsNoAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsNoAuthGuard]
    });
  });

  it('should ...', inject([IsNoAuthGuard], (guard: IsNoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
