import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMembershipFullmodalComponent } from './transfer-membership-fullmodal.component';

describe('TransferMembershipFullmodalComponent', () => {
  let component: TransferMembershipFullmodalComponent;
  let fixture: ComponentFixture<TransferMembershipFullmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferMembershipFullmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferMembershipFullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
