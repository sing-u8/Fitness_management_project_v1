import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingShowSaleModalComponent } from './setting-show-sale-modal.component';

describe('SettingShowSaleModalComponent', () => {
  let component: SettingShowSaleModalComponent;
  let fixture: ComponentFixture<SettingShowSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingShowSaleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingShowSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
