import * as Yup from 'yup';

export const createSessionSchema = Yup.object({
    sessionName: Yup.string().required().min(3),
    sessionExpiresAt: Yup.string().required("Session expiration date is required"),
    regenerateLinkToken: Yup.boolean().required(),
    linkExpiryFreequency: Yup.number().notRequired().min(20),
});