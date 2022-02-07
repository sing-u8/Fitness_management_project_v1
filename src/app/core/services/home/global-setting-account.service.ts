import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class GlobalSettingAccountService {
    private settingUser: {
        name: string
        email: string
        avatar: string
    } = {
        name: null,
        email: null,
        avatar: null,
    }

    changeFlag = false

    constructor() {
        this.settingUser.name = ''
        this.settingUser.email = ''
        this.settingUser.avatar = ''
    }

    setUserName(name: string) {
        this.settingUser.name = name
    }
    setUserEmail(email: string) {
        this.settingUser.email = email
    }
    setUserAvatar(avatar: string) {
        this.settingUser.avatar = avatar
    }

    getUserData() {
        return this.settingUser
    }
}
