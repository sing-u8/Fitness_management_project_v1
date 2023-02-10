import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCenterHeaderComponent } from './customer-center-header.component';

describe('CustomerCenterHeaderComponent', () => {
  let component: CustomerCenterHeaderComponent;
  let fixture: ComponentFixture<CustomerCenterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCenterHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCenterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
