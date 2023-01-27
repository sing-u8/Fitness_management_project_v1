import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'rw-free-try-footer',
    templateUrl: './free-try-footer.component.html',
    styleUrls: ['./free-try-footer.component.scss'],
})
export class FreeTryFooterComponent implements OnInit {
    public sec2FooterItemList = [
        '상담원 연결 없이도 즉시 무료로 사용 가능',
        '혼자서도 할 수 있는 간편 초기 설정',
        '이용 가이드 제공',
    ]

    constructor(private router: Router) {}

    ngOnInit(): void {}

    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
