import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable } from 'rxjs'
import { filter, switchMap, tap, catchError } from 'rxjs/operators'

import { UsersCenterService } from '@services/users-center.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { Loading } from '@schemas/componentStore/loading'
import { User } from '@schemas/user'

import * as _ from 'lodash'

export interface CentersState {
    gyms: Array<Center>
    loading: Loading
}
export const gymsInit: CentersState = { gyms: [], loading: 'idle' }

@Injectable()
export class GymsStore extends ComponentStore<CentersState> {
    public readonly gyms$ = this.select((s) => s.gyms)
    public readonly loading$ = this.select((s) => s.loading)

    private readonly user: User = this.storageService.getUser()

    constructor(private usersCenterService: UsersCenterService, private storageService: StorageService) {
        super(gymsInit)
    }

    getCenters() {
        this.patchState((s) => ({ loading: 'pending' }))
        this.loadGymsEffect('pending')
    }

    readonly updateGyms = this.updater((state, gyms: Array<Center>) => ({
        ...state,
        gyms: gyms,
        loading: 'done',
    }))

    readonly filterGym = this.updater((state, gymId: string) => {
        const filteredGyms = _.filter(this.get().gyms, (gym) => Number(gym.id) !== Number(gymId))
        return {
            ...state,
            gyms: filteredGyms,
        }
    })

    readonly leaveGymEffect = this.effect((gymId$: Observable<string>) => {
        return gymId$.pipe(
            switchMap((gymId) =>
                this.usersCenterService.leave(this.user.id, gymId).pipe(
                    tap({
                        next: (_) => {
                            this.filterGym(gymId)
                        },
                        error: (err) => {
                            console.log('gymsStore - usersCenterService.leave err: ', err)
                        },
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    })

    readonly loadGymsEffect = this.effect((loading$: Observable<Loading>) => {
        return loading$.pipe(
            filter((loading) => {
                return loading == 'pending'
            }),
            switchMap((_) =>
                this.usersCenterService.getCenterList(this.user.id).pipe(
                    tap({
                        next: (gyms) => {
                            this.updateGyms(gyms)
                        },
                        error: (e) => console.log('gymsStore - usersCenterService.getCenterList err: ', e),
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    })
}
