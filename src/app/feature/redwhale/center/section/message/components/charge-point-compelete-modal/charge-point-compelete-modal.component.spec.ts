import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePointCompeleteModalComponent } from './charge-point-compelete-modal.component';

describe('ChargePointCompeleteModalComponent', () => {
  let component: ChargePointCompeleteModalComponent;
  let fixture: ComponentFixture<ChargePointCompeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePointCompeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePointCompeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
