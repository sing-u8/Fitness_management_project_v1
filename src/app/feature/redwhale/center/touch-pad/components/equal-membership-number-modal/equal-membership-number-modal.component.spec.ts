import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqualMembershipNumberModalComponent } from './equal-membership-number-modal.component';

describe('EqualMembershipNumberModalComponent', () => {
  let component: EqualMembershipNumberModalComponent;
  let fixture: ComponentFixture<EqualMembershipNumberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqualMembershipNumberModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqualMembershipNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
