import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterListItemComponent } from './center-list-item.component'

describe('CenterListItemComponent', () => {
    let component: CenterListItemComponent
    let fixture: ComponentFixture<CenterListItemComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CenterListItemComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(CenterListItemComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
