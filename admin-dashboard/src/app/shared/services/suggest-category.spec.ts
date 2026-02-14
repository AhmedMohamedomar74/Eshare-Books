import { TestBed } from '@angular/core/testing';

import { SuggestCategory } from './suggest-category';

describe('SuggestCategory', () => {
  let service: SuggestCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
