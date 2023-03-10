import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Component({
    selector: 'db-register-membership-locker-page',
    templateUrl: './register-membership-locker-page.component.html',
    styleUrls: ['./register-membership-locker-page.component.scss'],
})
export class RegisterMembershipLockerPageComponent implements OnInit {
    constructor(private router: Router, private location: Location) {}

    ngOnInit(): void {}
}
