import { Component, OnInit, Input } from '@angular/core'

export type FaqListType = {
    title: string
    desc: string
    isOpen: boolean
}

@Component({
    selector: 'hp-faq-list-section',
    templateUrl: './faq-list-section.component.html',
    styleUrls: ['./faq-list-section.component.scss'],
})
export class FaqListSectionComponent implements OnInit {
    @Input() faqList: Array<FaqListType>
    constructor() {
        this.faqList = Array.from({ length: 12 }, (v, i) => ({
            title: '자주 묻는 질문',
            desc: '답변을 입력해주세요. 답변을 입력해주세요.',
            isOpen: false,
        }))
    }

    ngOnInit(): void {}

    toggleFAQ(idx: number) {
        this.faqList[idx].isOpen = !this.faqList[idx].isOpen
    }
}
