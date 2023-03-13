import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectRegisterMemberPageComponent } from './direct-register-member-page.component';

describe('DirectRegisterMemberPageComponent', () => {
  let component: DirectRegisterMemberPageComponent;
  let fixture: ComponentFixture<DirectRegisterMemberPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectRegisterMemberPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectRegisterMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
