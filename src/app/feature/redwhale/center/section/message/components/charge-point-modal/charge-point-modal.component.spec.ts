import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePointModalComponent } from './charge-point-modal.component';

describe('ChargePointModalComponent', () => {
  let component: ChargePointModalComponent;
  let fixture: ComponentFixture<ChargePointModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePointModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
