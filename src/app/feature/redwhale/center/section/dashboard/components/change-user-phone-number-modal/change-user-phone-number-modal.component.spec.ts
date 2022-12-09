import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserPhoneNumberModalComponent } from './change-user-phone-number-modal.component';

describe('ChangeUserPhoneNumberModalComponent', () => {
  let component: ChangeUserPhoneNumberModalComponent;
  let fixture: ComponentFixture<ChangeUserPhoneNumberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserPhoneNumberModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserPhoneNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
