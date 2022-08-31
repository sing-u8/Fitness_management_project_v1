import { ClickEmitterType } from '@schemas/components/button'

export interface HoldingConfirmOutput {
    date: {
        startDate: string
        endDate: string
    }
    loadingFns: ClickEmitterType
    holdWithLocker: boolean
}
