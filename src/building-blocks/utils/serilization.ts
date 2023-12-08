export const serializeObject = (value: any): string => {
    try {
        return JSON.stringify(value);
    } catch (error) {
        throw new Error(`Serialization failed: ${error}`);
    }
};

export const deserializeObject = <T>(value: string): T => {
    try {
        return JSON.parse(value) as T;
    } catch (error) {
        throw new Error(`Deserialization failed: ${error}`);
    }
};
