import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgUserListSelectComponent } from './msg-user-list-select.component';

describe('MsgUserListSelectComponent', () => {
  let component: MsgUserListSelectComponent;
  let fixture: ComponentFixture<MsgUserListSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgUserListSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgUserListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
