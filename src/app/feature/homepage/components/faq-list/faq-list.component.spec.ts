import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQListComponent } from './faq-list.component';

describe('FAQListComponent', () => {
  let component: FAQListComponent;
  let fixture: ComponentFixture<FAQListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
