import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

import { AuthService } from '@services/auth.service'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    TAG = '비밀번호 찾기'

    email: string

    constructor(private location: Location, private authService: AuthService, private nxStore: Store) {}

    ngOnInit() {}

    goBack() {
        this.location.back()
    }

    formCheck() {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (emailRegex.test(this.email)) {
            isValid = true
        }

        return isValid
    }

    sendResetPasswordLinkMail() {
        this.authService.sendResetPasswordLinkMail({ email: this.email }).subscribe({
            next: (v) => {
                this.email = ''
                this.nxStore.dispatch(showToast({ text: '메일이 발송되었습니다. 메일함을 확인해주세요!' }))
            },
            error: (e) => {
                if (e.code == 'FUNCTION_AUTH_002') {
                    this.nxStore.dispatch(showToast({ text: '가입되어 있지 않은 이메일입니다.' }))
                } else {
                    this.nxStore.dispatch(showToast({ text: e.message }))
                }
            },
        })
    }
}
