export function cleanPayload<T extends Record<string, any>>(payload: T): Partial<T> {
    const cleaned: Partial<T> = {};
    Object.entries(payload).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== '' &&
            (!(Array.isArray(value)) || value.length > 0) &&
            (!(typeof value === 'object' && !Array.isArray(value) && value !== null) || Object.keys(value).length > 0)
        ) {
            cleaned[key as keyof T] = value;
        }
    });
    return cleaned;
}
