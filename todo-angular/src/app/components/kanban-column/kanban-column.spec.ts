import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanColumn } from './kanban-column';
import { TaskService } from '../../services/tasks/task.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('KanbanColumn', () => {
  let component: KanbanColumn;
  let fixture: ComponentFixture<KanbanColumn>;
  let mockTaskService: any;

  beforeEach(async () => {
    mockTaskService = {
      changeStatus: vi.fn().mockResolvedValue(undefined),
      config: signal({
        'Priority Colors': {
          'Low': { 'bg-color': '#e2e8f0', 'text-color': '#475569' }
        }
      })
    };

    await TestBed.configureTestingModule({
      imports: [KanbanColumn],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanColumn);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('title', 'To Do');
    fixture.componentRef.setInput('tasks', []);
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain('To Do');
  });

  it('should display the count of tasks', () => {
    fixture.componentRef.setInput('tasks', [
      { Id: '1', Title: 'Task 1', Status: 'To Do' },
      { Id: '2', Title: 'Task 2', Status: 'To Do' }
    ]);
    fixture.detectChanges();
    
    const countElement = fixture.debugElement.query(By.css('span.bg-muted')).nativeElement;
    expect(countElement.textContent.trim()).toBe('2');
  });

  it('should emit onAddClick when add button is clicked', async () => {
    const onAddClickSpy = vi.spyOn(component.onAddClick, 'emit');
    const addButton = fixture.debugElement.query(By.css('button')).nativeElement;
    
    addButton.click();
    
    expect(onAddClickSpy).toHaveBeenCalledWith('To Do');
  });

  it('should show "No tasks yet" when tasks list is empty', () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();
    
    const noTasksMessage = fixture.debugElement.query(By.css('p.text-sm')).nativeElement;
    expect(noTasksMessage.textContent).toContain('No tasks yet');
  });

  it('should emit onAddClick when "Add your first task" is clicked', () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();
    
    const onAddClickSpy = vi.spyOn(component.onAddClick, 'emit');
    const addFirstTaskButton = fixture.debugElement.query(By.css('.text-primary')).nativeElement;
    
    addFirstTaskButton.click();
    
    expect(onAddClickSpy).toHaveBeenCalledWith('To Do');
  });

  it('should handle dragstart', () => {
    const mockEvent = {
      dataTransfer: {
        setData: vi.fn()
      }
    } as unknown as DragEvent;

    component.onDragStart(mockEvent, 'task-123');
    
    expect(mockEvent.dataTransfer?.setData).toHaveBeenCalledWith('text/plain', 'task-123');
  });

  it('should handle dragover', () => {
    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as Event;

    component.onDragOver(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle drop and call taskService.changeStatus', async () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        getData: vi.fn().mockReturnValue('task-123')
      }
    } as unknown as DragEvent;

    await component.onDragDrop(mockEvent, 'Done');
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockTaskService.changeStatus).toHaveBeenCalledWith('task-123', 'Done');
  });
});
