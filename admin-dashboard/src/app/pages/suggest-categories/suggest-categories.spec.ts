import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestCategories } from './suggest-categories';

describe('SuggestCategories', () => {
  let component: SuggestCategories;
  let fixture: ComponentFixture<SuggestCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
