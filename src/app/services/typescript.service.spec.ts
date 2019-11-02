import { TestBed } from '@angular/core/testing';

import { TypescriptService } from './typescript.service';

describe('TypescriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypescriptService = TestBed.get(TypescriptService);
    expect(service).toBeTruthy();
  });
});
