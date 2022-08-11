import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyContractFullmodalComponent } from './modify-contract-fullmodal.component';

describe('ModifyContractFullmodalComponent', () => {
  let component: ModifyContractFullmodalComponent;
  let fixture: ComponentFixture<ModifyContractFullmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyContractFullmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyContractFullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
