import { PaymentItem } from '@schemas/components/payment-item'

export const paymentItemList: PaymentItem[] = [
    {
        top: {
            title: '월 이용권',
            desc: '매월 자동 결제되는 요금제',
        },
        middle: {
            discountText: '런칭 기념 5% 할인 (첫 6개월간)',
            originalPrice: '39,000원',
            price: '37,000원',
            desc: '1개 센터 기준 / 월',
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '자동 결제' },
            { left: '결제 금액', right: '37,000원 / 월' },
            { left: '환불 기간', right: '7일 이내 환불 가능' },
        ],
        type: 'month',
        count: 1,
    },
    {
        top: {
            title: '1년 이용권',
            desc: '1년 요금을 선납 결제하는 요금제',
        },
        middle: {
            discountText: '런칭 기념 15% 할인',
            originalPrice: '39,000원',
            price: '33,000원',
            desc: '1개 센터 기준 / 월 (연간 계약)',
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '직접 결제 (선납)' },
            { left: '결제 금액', right: '396,000원 / 1년' },
            { left: '환불 기간', right: '30일 이내 환불 가능' },
        ],
        highlight: '🎉  가장 인기가 많아요!',
        type: 'year',
        count: 1,
    },
    {
        top: {
            title: '2년 이용권',
            desc: '2년 요금을 선납 결제하는 요금제',
        },
        middle: {
            discountText: '런칭 기념 30% 할인',
            originalPrice: '39,000원',
            price: '27,300원',
            desc: '1개 센터 기준 / 월 (2년간 계약)',
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '직접 결제 (선납)' },
            { left: '결제 금액', right: '655,000원 / 2년' },
            { left: '환불 기간', right: '30일 이내 환불 가능' },
        ],
        type: 'year',
        count: 2,
    },
    {
        top: {
            title: '평생 이용권',
            desc: '단 한 번 결제로 평생 이용하는 요금제',
        },
        middle: {
            discountText: '런칭 기념 45% 할인',
            originalPrice: '1,380,000원',
            price: '759,000원',
            desc: '1개 센터 기준 / 평생',
        },
        bottom: [
            { left: '기능 제한', right: '없음' },
            { left: '결제 방식', right: '직접 결제 (선납)' },
            { left: '결제 금액', right: '759,000원 / 평생' },
            { left: '환불 기간', right: '90일 이내 환불 가능' },
        ],
        highlight: '👍  레드웨일 추천',
        type: 'whole_time',
        count: 1,
    },
]
