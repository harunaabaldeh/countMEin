import * as Yup from 'yup';

export const createSessionSchema = Yup.object({
    sessionName: Yup.string().required().min(3),
    sessionExpiresAt: Yup.date().required("Session expiration date is required"),
    regenerateQRCode: Yup.boolean().required(),
    linkExpiryFreequency: Yup.number().notRequired().min(20),
});