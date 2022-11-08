import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiInstructorSelectComponent } from './multi-instructor-select.component';

describe('MultiInstructorSelectComponent', () => {
  let component: MultiInstructorSelectComponent;
  let fixture: ComponentFixture<MultiInstructorSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiInstructorSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiInstructorSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
