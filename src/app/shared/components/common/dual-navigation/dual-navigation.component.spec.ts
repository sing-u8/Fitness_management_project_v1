import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualNavigationComponent } from './dual-navigation.component';

describe('DualNavigationComponent', () => {
  let component: DualNavigationComponent;
  let fixture: ComponentFixture<DualNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
