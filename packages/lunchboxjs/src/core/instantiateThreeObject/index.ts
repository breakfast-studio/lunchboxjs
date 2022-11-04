import { catalogue } from '../../components'
import * as THREE from 'three'
import { processPropAsArray } from './processProps'
import type { Lunch } from '../..'

export function instantiateThreeObject<T>(node: Lunch.StandardMeta<T>) {
    if (!node.type) return null

    // what class will we be instantiating?
    const uppercaseType = node.type[0].toUpperCase() + node.type.slice(1)
    const translatedType = uppercaseType.replace(/Lunchbox$/, '')
    const targetClass =
        catalogue[node.type] ||
        (THREE as any)[uppercaseType] ||
        catalogue[translatedType] ||
        (THREE as any)[translatedType]
    if (!targetClass)
        throw `${uppercaseType} is not part of the THREE namespace! Did you forget to extend? import {extend} from 'lunchbox'; extend({app, YourComponent, ...})`

    // what args have we been provided?
    const args: Array<any> = node.props.args ?? []

    // replace $attached values with their instances
    // we need to guarantee everything comes back as an array so we can spread $attachedArrays,
    // so we'll use processPropAsArray
    const argsWrappedInArrays = args.map((arg: any) => {
        return processPropAsArray({ node, prop: arg })
    })
    let processedArgs = [] as Array<any>
    argsWrappedInArrays.forEach((arr) => {
        processedArgs = processedArgs.concat(arr)
    })

    const instance = new targetClass(...processedArgs)

    return instance as T
}
