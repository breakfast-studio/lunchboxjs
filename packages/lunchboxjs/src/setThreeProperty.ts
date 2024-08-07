import { get, isNumber, set } from "./utils";
import * as THREE from 'three';

export const setThreeProperty = <T extends object>(target: T, split: string[], parsedValue: unknown) => {
    const property: {
        setScalar?: (n: number) => unknown,
        set?: (...args: unknown[]) => unknown,
    } | undefined = get(target, split);

    if (isNumber(parsedValue) && property?.setScalar) {
        // Set scalar
        property.setScalar(+parsedValue);
    } else if (property?.set) {
        if (typeof parsedValue === 'string') {
            const asNumbers = parsedValue.split(',');
            const isAllNumbers = asNumbers.every(n => !n.match(/^[^\d,]+$/));

            // handle hash hex numbers
            if (parsedValue.toLowerCase().trim().match(/^#[\dabcdef]{3,6}$/)?.length) {
                if (parsedValue.length === 4) {
                    const str = [parsedValue[1], parsedValue[1], parsedValue[2], parsedValue[2], parsedValue[3], parsedValue[3]].join('');
                    property.set(+`0x${str}`);
                } else {
                    property.set(+`0x${parsedValue.slice(1)}`);
                }
            } else if (asNumbers?.length && isAllNumbers) {
                // assume this is a string like `1,2,3`
                // and try converting to an array of numbers
                // (we get arrays as strings like this from Vue, for example)
                property.set(...asNumbers.map(n => +n));
            } else {
                property.set(parsedValue);
            }
        }
        else {
            // Set as values in an array
            const parsedValueAsArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
            property.set(...parsedValueAsArray);
        }
    } else {
        // Manually set
        set(target, split, parsedValue);
    }

    // handle common update functions
    const targetAsMaterial = target as THREE.Material;
    if (typeof targetAsMaterial.type === 'string' && targetAsMaterial.type?.toLowerCase().endsWith('material')) {
        targetAsMaterial.needsUpdate = true;
    }
};