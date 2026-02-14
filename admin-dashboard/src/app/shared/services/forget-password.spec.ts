import { TestBed } from '@angular/core/testing';

import { ForgetPassword } from './forget-password';

describe('ForgetPassword', () => {
  let service: ForgetPassword;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgetPassword);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
