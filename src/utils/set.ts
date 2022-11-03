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
