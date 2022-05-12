import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickModalComponent } from './datepick-modal.component';

describe('DatepickModalComponent', () => {
  let component: DatepickModalComponent;
  let fixture: ComponentFixture<DatepickModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
