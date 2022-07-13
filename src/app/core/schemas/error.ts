export interface Error {
    code: string
    message: string
}

export interface ErrorObj {
    error: {
        code: string
        message: string
    }
    headers: any
    message: string
    name: string
    ok: boolean
    status: number
    statusText: string
    url: string
}
