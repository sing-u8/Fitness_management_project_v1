import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseJournalComponent } from './exercise-journal.component';

describe('ExerciseJournalComponent', () => {
  let component: ExerciseJournalComponent;
  let fixture: ComponentFixture<ExerciseJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
