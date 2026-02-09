import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorInputGroup } from './color-input-group';

describe('ColorInputGroup', () => {
  let component: ColorInputGroup;
  let fixture: ComponentFixture<ColorInputGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorInputGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorInputGroup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
