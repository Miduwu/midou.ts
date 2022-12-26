export interface Timeout {
    id: string
    time: number
    expires: number
    data: any
    cancelled: boolean
}

export interface TimeoutOptions {
    restore: boolean
}

export interface Events {
    'expires': (timeout: Timeout) => void
    'deleted': (timeout: Timeout) => void
    'create': (timeout: Timeout) => void
    'ready': (timeouts: Timeouts) => void
}

