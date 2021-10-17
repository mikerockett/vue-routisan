import { RouteOptions, RouteGuard, VueComponent } from "./types";
import setters from "./setters";

type Setters = typeof setters;
type SetterKey = (keyof Setters) | (keyof RouteOptions);
type SetterValue<Key extends SetterKey> = Key extends keyof Setters ? Setters[Key] : RouteOptions[Key];

declare class Route {
    protected config: RouteOptions;
    protected _guards: RouteGuard[];

    constructor(path: string, key: string, value: VueComponent);

    public options<Options extends Record<string, any>>(options: Options): Route;
    public name(name: string): Route;
    public guard(guard: RouteGuard): Route;
    public children(routes: Function): Route;

    protected _set(key: SetterKey, value: SetterValue<SetterKey>): void;
}

export default Route
