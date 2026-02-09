import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStatusInput } from './workflow-status-input';

describe('WorkflowStatusInput', () => {
  let component: WorkflowStatusInput;
  let fixture: ComponentFixture<WorkflowStatusInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowStatusInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowStatusInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
