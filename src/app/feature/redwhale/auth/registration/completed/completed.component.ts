import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'completed',
    templateUrl: './completed.component.html',
    styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit {
    TAG = '회원가입'

    user: User

    constructor(private router: Router, private storageService: StorageService) {}

    ngOnInit(): void {
        this.user = this.storageService.getUser()
    }

    next() {
        this.router.navigateByUrl('/redwhale-home')
    }
}
