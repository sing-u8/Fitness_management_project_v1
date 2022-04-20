import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchModifyRepeatLessonModalComponent } from './sch-modify-repeat-lesson-modal.component';

describe('SchModifyRepeatLessonModalComponent', () => {
  let component: SchModifyRepeatLessonModalComponent;
  let fixture: ComponentFixture<SchModifyRepeatLessonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchModifyRepeatLessonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchModifyRepeatLessonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
