import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserBirthDateModalComponent } from './change-user-birth-date-modal.component';

describe('ChangeUserBirthDateModalComponent', () => {
  let component: ChangeUserBirthDateModalComponent;
  let fixture: ComponentFixture<ChangeUserBirthDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserBirthDateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserBirthDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
