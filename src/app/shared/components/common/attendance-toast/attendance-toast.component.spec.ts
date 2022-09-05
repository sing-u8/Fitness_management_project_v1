import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceToastComponent } from './attendance-toast.component';

describe('AttendanceToastComponent', () => {
  let component: AttendanceToastComponent;
  let fixture: ComponentFixture<AttendanceToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceToastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
