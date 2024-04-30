export const get = <T = unknown>(
    obj: Record<string, any>,
    path: string | string[],
    defValue?: T
) => {
    // If path is not defined or it has false value
    if (!path) return undefined
    // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
    // Find value
    const result = pathArray?.reduce(
        (prevObj: Record<string, any>, key: string) => prevObj && prevObj[key],
        obj
    )
    // If found value is undefined return default value; otherwise return the value
    return result === undefined ? defValue : result
}

export function isClass(obj: any): obj is IsClass {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isCtorClass
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isCtorClass || isPrototypeCtorClass
}

export type IsClass<T = unknown> = {
    new(...args: any): T
}

export const set = (
    obj: Record<string, any>,
    path: string | string[],
    value: any
) => {
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

    pathArray?.reduce((acc: Record<string, any>, key: string, i: number) => {
        if (acc[key] === undefined) acc[key] = {}
        if (i === pathArray.length - 1) acc[key] = value
        return acc[key]
    }, obj)
}
