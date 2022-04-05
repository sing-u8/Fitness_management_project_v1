import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import _ from 'lodash'

import { LockerItem } from '@schemas/locker-item'

@Injectable({
    providedIn: 'root',
})
export class SecLockerStateService {
    public lockerItemListState: BehaviorSubject<Array<LockerItem>>

    constructor() {
        this.lockerItemListState = new BehaviorSubject<Array<LockerItem>>([])
    }

    // locker item list
    get lockerItemList() {
        return this.lockerItemListState.getValue()
    }
    setLockerItemList(newState: Array<LockerItem>) {
        this.lockerItemListState.next(newState)
    }
    selectLockerItemList<k>(mapFn: (state: Array<LockerItem>) => k): Observable<k> {
        return this.lockerItemListState.asObservable().pipe(
            map((state: Array<LockerItem>) => mapFn(state)),
            distinctUntilChanged()
        )
    }
    resetLockerItemList() {
        this.lockerItemListState.next([])
    }
}
