import { get, isNumber, set } from "./utils";

export const setThreeProperty = <T extends object>(target: T, split: string[], parsedValue: string) => {
    const property: {
        setScalar?: (n: number) => unknown,
        set?: (...args: unknown[]) => unknown,
    } | undefined = get(target, split);

    if (isNumber(parsedValue) && property?.setScalar) {
        // Set scalar
        property.setScalar(+parsedValue);
    } else if (property?.set) {
        // try converting to an array of numbers
        const asNumbers = parsedValue.split(',');
        const isAllNumbers = asNumbers.every(n => n.match(/\d+/));
        if (asNumbers?.length && isAllNumbers) {
            property.set(...asNumbers.map(n => +n));
        } else {
            // Set as values in an array
            const parsedValueAsArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
            property.set(...parsedValueAsArray);
        }

    } else {
        // Manually set
        set(target, split, parsedValue);
    }

};