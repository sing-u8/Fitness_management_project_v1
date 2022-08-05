import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterRolemodalComponent } from './center-rolemodal.component'

describe('RolemodalComponent', () => {
    let component: CenterRolemodalComponent
    let fixture: ComponentFixture<CenterRolemodalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CenterRolemodalComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(CenterRolemodalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
