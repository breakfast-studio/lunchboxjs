// Copied from https://dev.to/tipsy_dev/advanced-typescript-reinventing-lodash-get-4fhe
type FieldWithPossiblyUndefined<T, Key> =
    | GetFieldType<Exclude<T, undefined>, Key>
    | Extract<T, undefined>

type GetIndexedField<T, K> = K extends keyof T
    ? T[K]
    : K extends `${number}`
    ? '0' extends keyof T // tuples have string keys, return undefined if K is not in tuple
        ? undefined
        : number extends keyof T
        ? T[number]
        : undefined
    : undefined

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
    ? Left extends keyof T
        ? FieldWithPossiblyUndefined<T[Left], Right>
        : Left extends `${infer FieldKey}[${infer IndexKey}]`
        ? FieldKey extends keyof T
            ? FieldWithPossiblyUndefined<
                  | GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
                  | Extract<T[FieldKey], undefined>,
                  Right
              >
            : undefined
        : undefined
    : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
    ? FieldKey extends keyof T
        ?
              | GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
              | Extract<T[FieldKey], undefined>
        : undefined
    : undefined

export function get<
    TData,
    TPath extends string,
    TDefault = GetFieldType<TData, TPath>
>(
    data: TData,
    path: TPath,
    defaultValue?: TDefault
): GetFieldType<TData, TPath> | TDefault {
    const value = path
        .split(/[.[\]]/)
        .filter(Boolean)
        .reduce<GetFieldType<TData, TPath>>(
            (value, key) => (value as any)?.[key],
            data as any
        )

    return value !== undefined ? value : (defaultValue as TDefault)
}
