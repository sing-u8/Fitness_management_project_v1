import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DwMemberListComponent } from './dw-member-list.component'

describe('DwMemberListComponent', () => {
    let component: DwMemberListComponent
    let fixture: ComponentFixture<DwMemberListComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DwMemberListComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DwMemberListComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
