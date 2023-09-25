import { PaginationParams } from "./models/pagination";

export const getAxiosParams = (paginationParams: PaginationParams) => {
    const params = new URLSearchParams();
    Object.entries(paginationParams).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            params.delete(key);
        }
    });
    return params;
};