import { Component, OnInit } from '@angular/core'

import _ from 'lodash'

type NaviType = {
    [K in NaviTypeKeys]: boolean
}
type NaviTypeKeys = 'reentrance' | 'counselMember' | 'adjustSchedule' | 'manageWorkout'

@Component({
    selector: 'hp-main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./main-carousel.component.scss'],
})
export class MainCarouselComponent implements OnInit {
    public naviObj: NaviType = {
        reentrance: true,
        counselMember: false,
        adjustSchedule: false,
        manageWorkout: false,
    }

    constructor() {}

    ngOnInit(): void {}

    naviTo(prop: NaviTypeKeys) {
        _.forIn(this.naviObj, (_, key) => {
            if (prop == key) {
                this.naviObj[key] = true
            } else {
                this.naviObj[key] = false
            }
        })
    }
}
