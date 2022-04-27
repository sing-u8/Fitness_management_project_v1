import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectRegisterMemberFullmodalComponent } from './direct-register-member-fullmodal.component';

describe('DirectRegisterMemberFullmodalComponent', () => {
  let component: DirectRegisterMemberFullmodalComponent;
  let fixture: ComponentFixture<DirectRegisterMemberFullmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectRegisterMemberFullmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectRegisterMemberFullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
