import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerWindowRegisteredComponent } from './locker-window-registered.component';

describe('LockerWindowRegisteredComponent', () => {
  let component: LockerWindowRegisteredComponent;
  let fixture: ComponentFixture<LockerWindowRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockerWindowRegisteredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerWindowRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
