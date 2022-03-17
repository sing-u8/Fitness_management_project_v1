import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
    selector: 'hp-free-start-footer',
    templateUrl: './free-start-footer.component.html',
    styleUrls: ['./free-start-footer.component.scss'],
})
export class FreeStartFooterComponent implements OnInit {
    constructor(private deviceDetector: DeviceDetectorService, private router: Router) {}

    ngOnInit(): void {}

    // ----------  free start modal ---------------//
    public isFreeStartModalVisible = false
    toggleFreeStartModalVisible() {
        if (this.deviceDetector.isDesktop()) {
            this.router.navigateByUrl('/auth/login')
        } else {
            this.isFreeStartModalVisible = !this.isFreeStartModalVisible
        }
    }
    onFreeStartCancel() {
        this.isFreeStartModalVisible = false
    }
}
