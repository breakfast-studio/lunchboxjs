/* eslint-disable @typescript-eslint/no-explicit-any */
/** Get potentially nested property in object */
export const get = <T = unknown>(
    obj: any,
    path: string | string[],
    defValue?: T
) => {
    // If path is not defined or it has false value
    if (!path) return undefined;
    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    // Find value
    const result = pathArray?.reduce(
        (prevObj: Record<string, any>, key: string) => prevObj && prevObj[key],
        obj
    );
    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Check if `obj` contains a constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function isClass(obj: any): obj is IsClass {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class';
    if (obj.prototype === undefined) {
        return isCtorClass;
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class';
    return isCtorClass || isPrototypeCtorClass;
}

export type IsClass<T = unknown> = {
    new(...args: any[]): T
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** `isNumber` from lodash */
const buildIsNumber = () => {
    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Available under MIT license <https://lodash.com/license>
     */

    /** `Object#toString` result references. */
    const numberTag = '[object Number]';

    /** Used for built-in method references. */
    const objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    const objectToString = objectProto.toString;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    function isObjectLike(value: any) {
        return !!value && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    const output = function isNumber(value: any) {
        return (
            typeof value == 'number' ||
            (isObjectLike(value) && objectToString.call(value) == numberTag)
        );
    };
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return output;
};

/** Check if a given value is a number */
export const isNumber = buildIsNumber();

/** Set a potentially-nested property to a given value */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const set = (
    obj: Record<string, any>,
    path: string | string[],
    value: unknown
) => {
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

    pathArray?.reduce((acc, key: string, i: number) => {
        if (acc[key] === undefined) acc[key] = {};
        if (i === pathArray.length - 1) acc[key] = value;
        return acc[key];
    }, obj);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const THREE_UUID_ATTRIBUTE_NAME = 'data-three-uuid';