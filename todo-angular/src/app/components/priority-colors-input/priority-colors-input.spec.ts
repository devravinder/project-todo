import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityColorsInput } from './priority-colors-input';

describe('PriorityColorsInput', () => {
  let component: PriorityColorsInput;
  let fixture: ComponentFixture<PriorityColorsInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityColorsInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityColorsInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
