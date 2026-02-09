import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPreview } from './color-preview';

describe('ColorPreview', () => {
  let component: ColorPreview;
  let fixture: ComponentFixture<ColorPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
