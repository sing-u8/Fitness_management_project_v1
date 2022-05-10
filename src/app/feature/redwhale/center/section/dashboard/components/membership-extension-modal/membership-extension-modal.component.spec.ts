import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipExtensionModalComponent } from './membership-extension-modal.component';

describe('MembershipExtensionModalComponent', () => {
  let component: MembershipExtensionModalComponent;
  let fixture: ComponentFixture<MembershipExtensionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipExtensionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipExtensionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
