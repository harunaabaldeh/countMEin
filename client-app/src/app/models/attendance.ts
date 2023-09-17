
import { User } from "./user";

export interface Attendant {
    id: string;
    sessionId: string;
    userId: string;
    user: User;
}
