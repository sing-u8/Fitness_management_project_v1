import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterPreviewItemComponent } from './center-preview-item.component';

describe('CenterPreviewItemComponent', () => {
  let component: CenterPreviewItemComponent;
  let fixture: ComponentFixture<CenterPreviewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterPreviewItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterPreviewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
