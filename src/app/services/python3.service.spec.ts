import { TestBed } from '@angular/core/testing';

import { Python3Service } from './python3.service';

describe('Python3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Python3Service = TestBed.get(Python3Service);
    expect(service).toBeTruthy();
  });
});
