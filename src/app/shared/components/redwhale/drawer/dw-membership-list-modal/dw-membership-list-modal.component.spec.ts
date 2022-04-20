import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwMembershipListModalComponent } from './dw-membership-list-modal.component';

describe('DwMembershipListModalComponent', () => {
  let component: DwMembershipListModalComponent;
  let fixture: ComponentFixture<DwMembershipListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwMembershipListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwMembershipListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
