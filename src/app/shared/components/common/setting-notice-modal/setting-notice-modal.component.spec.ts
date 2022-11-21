import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingNoticeModalComponent } from './setting-notice-modal.component'

describe('SettingNoticeModalComponent', () => {
    let component: SettingNoticeModalComponent
    let fixture: ComponentFixture<SettingNoticeModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingNoticeModalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingNoticeModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
