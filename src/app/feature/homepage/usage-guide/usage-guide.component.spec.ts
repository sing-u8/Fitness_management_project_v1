import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageGuideComponent } from './usage-guide.component';

describe('UsageGuideComponent', () => {
  let component: UsageGuideComponent;
  let fixture: ComponentFixture<UsageGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
