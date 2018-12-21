import { TestBed } from '@angular/core/testing';

import { Jwt.Interceptor.TsService } from './jwt.interceptor.ts.service';

describe('Jwt.Interceptor.TsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Jwt.Interceptor.TsService = TestBed.get(Jwt.Interceptor.TsService);
    expect(service).toBeTruthy();
  });
});
