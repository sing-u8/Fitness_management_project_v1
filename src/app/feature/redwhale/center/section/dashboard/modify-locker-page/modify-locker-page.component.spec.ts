import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyLockerPageComponent } from './modify-locker-page.component';

describe('ModifyLockerPageComponent', () => {
  let component: ModifyLockerPageComponent;
  let fixture: ComponentFixture<ModifyLockerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyLockerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyLockerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
