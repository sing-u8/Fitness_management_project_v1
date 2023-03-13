import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMembershipPageComponent } from './transfer-membership-page.component';

describe('TransferMembershipPageComponent', () => {
  let component: TransferMembershipPageComponent;
  let fixture: ComponentFixture<TransferMembershipPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferMembershipPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferMembershipPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
