import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSignBoxComponent } from './contract-sign-box.component';

describe('ContractSignBoxComponent', () => {
  let component: ContractSignBoxComponent;
  let fixture: ComponentFixture<ContractSignBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractSignBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSignBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
