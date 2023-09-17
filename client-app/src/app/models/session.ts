import { Attendant } from "./attendance";

export interface SessionFormValues {
    sessionName: string;
    sessionExpiresAt: Date;
    linkExpiryFreequency?: number;
    regenerateQRCode: boolean;
}

export interface Session {
    id: string;
    sessionName: string;
    sessionExpiresAt: Date;
    linkExpiryFreequency: number;
    linkToken: string;
    qrCode: string;
    attendants: Attendant[];
}
