import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSenderPhoneModalComponent } from './register-sender-phone-modal.component';

describe('RegisterSenderPhoneModalComponent', () => {
  let component: RegisterSenderPhoneModalComponent;
  let fixture: ComponentFixture<RegisterSenderPhoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSenderPhoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSenderPhoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
