export interface Modal {
    isVisible: boolean
    data: ModalData
}
export interface ModalData {
    text: string
    subText: string
    cancelButtonText?: string
    confirmButtonText?: string
}
