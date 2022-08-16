import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTransSettingBoxComponent } from './auto-trans-setting-box.component';

describe('AutoTransSettingBoxComponent', () => {
  let component: AutoTransSettingBoxComponent;
  let fixture: ComponentFixture<AutoTransSettingBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoTransSettingBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTransSettingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
