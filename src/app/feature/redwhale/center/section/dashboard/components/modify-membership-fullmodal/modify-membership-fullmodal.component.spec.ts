import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMembershipFullmodalComponent } from './modify-membership-fullmodal.component';

describe('ModifyMembershipFullmodalComponent', () => {
  let component: ModifyMembershipFullmodalComponent;
  let fixture: ComponentFixture<ModifyMembershipFullmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyMembershipFullmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMembershipFullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
