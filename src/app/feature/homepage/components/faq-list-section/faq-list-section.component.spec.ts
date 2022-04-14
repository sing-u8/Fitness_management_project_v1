import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqListSectionComponent } from './faq-list-section.component';

describe('FaqListSectionComponent', () => {
  let component: FaqListSectionComponent;
  let fixture: ComponentFixture<FaqListSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqListSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
