import { InstanceEvent, LoadedEvent, ThreeIntersectEvent } from './src/index';

interface ElementEventMap {
    'instancecreated': CustomEvent<InstanceEvent>;
    'loaded': CustomEvent<LoadedEvent>;
    'threepointermove': CustomEvent<ThreeIntersectEvent>;
    'threeclick': CustomEvent<ThreeIntersectEvent>;
}
declare global {
    interface HTMLElement {
        addEventListener<K extends keyof ElementEventMap>(type: K,
            listener: (this: Document, ev: ElementEventMap[K]) => void): void;
        dispatchEvent<K extends keyof ElementEventMap>(ev: ElementEventMap[K]): void;
    }
}
