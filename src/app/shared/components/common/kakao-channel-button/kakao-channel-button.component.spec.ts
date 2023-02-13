import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakaoChannelButtonComponent } from './kakao-channel-button.component';

describe('KakaoChannelButtonComponent', () => {
  let component: KakaoChannelButtonComponent;
  let fixture: ComponentFixture<KakaoChannelButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KakaoChannelButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KakaoChannelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
