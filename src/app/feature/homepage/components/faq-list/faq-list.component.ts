import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'

export type FaqListType = {
    title: string
    desc: string
    isOpen: boolean
}

@Component({
    selector: 'hp-faq-list',
    templateUrl: './faq-list.component.html',
    styleUrls: ['./faq-list.component.scss'],
})
export class FAQListComponent implements OnInit {
    @Input() animation = false
    @Input() faqList: Array<FaqListType> = [
        {
            title: '자주 묻는 질문 1',
            desc: '답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        },
        {
            title: '자주 묻는 질문 2',
            desc: '답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        },
        {
            title: '자주 묻는 질문 3',
            desc: '답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        },
        {
            title: '자주 묻는 질문 4',
            desc: '답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        },
        {
            title: '자주 묻는 질문 5',
            desc: '답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        },
    ]
    constructor(private router: Router) {}

    ngOnInit(): void {}

    toggleFAQ(idx: number) {
        this.faqList[idx].isOpen = !this.faqList[idx].isOpen
    }

    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
