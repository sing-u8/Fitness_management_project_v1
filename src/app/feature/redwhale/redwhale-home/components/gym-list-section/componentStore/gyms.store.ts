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
    centers: Array<Center>
    loading: Loading
}
export const centersInit: CentersState = { centers: [], loading: 'idle' }

@Injectable()
export class GymsStore extends ComponentStore<CentersState> {
    public readonly centers$ = this.select((s) => s.centers)
    public readonly loading$ = this.select((s) => s.loading)

    private readonly user: User = this.storageService.getUser()

    constructor(private usersCenterService: UsersCenterService, private storageService: StorageService) {
        super(centersInit)
    }

    getCenters() {
        this.patchState((s) => ({ loading: 'pending' }))
        this.loadGymsEffect('pending')
    }

    readonly updateGyms = this.updater((state, centers: Array<Center>) => ({
        ...state,
        centers: centers,
        loading: 'done',
    }))

    readonly filterGym = this.updater((state, centerId: string) => {
        const filteredGyms = _.filter(this.get().centers, (center) => Number(center.id) !== Number(centerId))
        return {
            ...state,
            centers: filteredGyms,
        }
    })

    readonly leaveGymEffect = this.effect((centerId$: Observable<string>) => {
        return centerId$.pipe(
            switchMap((centerId) =>
                this.usersCenterService.leave(this.user.id, centerId).pipe(
                    tap({
                        next: (_) => {
                            this.filterGym(centerId)
                        },
                        error: (err) => {
                            console.log('centersStore - usersCenterService.leave err: ', err)
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
                        next: (centers) => {
                            this.updateGyms(centers)
                        },
                        error: (e) => console.log('centersStore - usersCenterService.getCenterList err: ', e),
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    })
}
