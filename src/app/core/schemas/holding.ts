export interface Holding {
    id: string
    start_date: string
    end_date: string
    state_code: 'holding_state_ready' | 'holding_state_paused'
    state_code_name: string
}
