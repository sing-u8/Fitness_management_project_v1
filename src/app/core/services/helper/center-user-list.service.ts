import { Injectable } from '@angular/core'

import { CenterUsersService } from '@services/center-users.service'

import { map } from 'rxjs'
import _ from 'lodash'

import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class CenterUserListService {
    constructor(private centerUsersApi: CenterUsersService) {}

    getCenterUserList(centerId: string, filterFn: (v: CenterUser, i?: number) => boolean) {
        return this.centerUsersApi
            .getUserList(centerId)
            .pipe(map((centerUserList) => _.filter(centerUserList, filterFn)))
    }

    getCenterInstructorList(centerId: string) {
        return this.centerUsersApi
            .getUserList(centerId)
            .pipe(map((centerUserList) => _.filter(centerUserList, (centerUser) => centerUser.role_code != 'member')))
    }
}
