import { Attendee } from "./attendance";

export interface SessionFormValues {
    sessionName: string
    sessionExpiresAt: string
    linkExpiryFreequency: number
    regenerateLinkToken: boolean
}

export interface Session {
    sessionId: string
    sessionName: string
    sessionExpiresAt: string
    hostName: string
    linkToken: string
    attendeesCount: number
    status: string
    linkExpiryFreequency: number
    regenerateLinkToken: boolean
}

export interface SessionAttendees {
    sessionId: string
    sessionName: string
    sessionExpiresAt: string
    hostName: string
    linkToken: string
    attendees: Attendee[];
    attendeesCount: number
    status: string
}
