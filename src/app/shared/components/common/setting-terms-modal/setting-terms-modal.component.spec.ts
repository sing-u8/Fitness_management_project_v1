import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTermsModalComponent } from './setting-terms-modal.component';

describe('SettingTermsModalComponent', () => {
  let component: SettingTermsModalComponent;
  let fixture: ComponentFixture<SettingTermsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingTermsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTermsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
