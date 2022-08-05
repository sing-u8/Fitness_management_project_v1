import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolemodalComponent } from './rolemodal.component';

describe('RolemodalComponent', () => {
  let component: RolemodalComponent;
  let fixture: ComponentFixture<RolemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolemodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
