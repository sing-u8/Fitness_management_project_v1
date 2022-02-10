import { LockerTicket } from './locker-ticket'

export interface LockerItem {
    id: string
    status: string
    status_name: string
    name: string
    x: number
    y: number
    rows: number
    cols: number
    locker_ticket: LockerTicket
}
