import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFlipListComponent } from './lesson-flip-list.component';

describe('LessonFlipListComponent', () => {
  let component: LessonFlipListComponent;
  let fixture: ComponentFixture<LessonFlipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonFlipListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonFlipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
