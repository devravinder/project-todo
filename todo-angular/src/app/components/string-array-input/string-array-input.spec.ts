import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringArrayInput } from './string-array-input';

describe('StringArrayInput', () => {
  let component: StringArrayInput;
  let fixture: ComponentFixture<StringArrayInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringArrayInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringArrayInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
