import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable } from 'rxjs'
import { filter, switchMap, tap, catchError } from 'rxjs/operators'

import { UserGymService } from '@services/user-gym.service'
import { StorageService } from '@services/storage.service'

import { Gym } from '@schemas/gym'
import { Loading } from '@schemas/componentStore/loading'
import { User } from '@schemas/user'

import * as _ from 'lodash'

export interface GymsState {
    gyms: Array<Gym>
    loading: Loading
}
export const gymsInit: GymsState = { gyms: [], loading: 'idle' }

@Injectable()
export class GymsStore extends ComponentStore<GymsState> {
    public readonly gyms$ = this.select((s) => s.gyms)
    public readonly loading$ = this.select((s) => s.loading)

    private readonly user: User = this.storageService.getUser()

    constructor(private userGymService: UserGymService, private storageService: StorageService) {
        super(gymsInit)
    }

    getGyms() {
        this.patchState((s) => ({ loading: 'pending' }))
        this.loadGymsEffect('pending')
    }

    readonly updateGyms = this.updater((state, gyms: Array<Gym>) => ({
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
                this.userGymService.leave(this.user.id, gymId).pipe(
                    tap({
                        next: (_) => {
                            this.filterGym(gymId)
                        },
                        error: (err) => {
                            console.log('gymsStore - userGymService.leave err: ', err)
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
                this.userGymService.getGymList(this.user.id).pipe(
                    tap({
                        next: (gyms) => {
                            this.updateGyms(gyms)
                        },
                        error: (e) => console.log('gymsStore - userGymService.getGymList err: ', e),
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    })
}
