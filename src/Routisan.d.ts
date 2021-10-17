import type Route from "./Route";
import type { RouteGroupOptions, VueComponent, RouteConfig, ComponentResolver } from "./types";

declare class Routisan {
    protected _routes: Route[];
    protected _groupStack: RouteGroupOptions[];

    constructor();

    public setViewResolver(resolver: ComponentResolver): void;

    public view<
        Data=DefaultData<never>,
        Methods=DefaultMethods<never>,
        Computed=DefaultComputed,
        Props=DefaultProps
    >(path: string, component: VueComponent<Data, Methods, Computed, Props>): Route;

    public redirect<
        Data=DefaultData<never>,
        Methods=DefaultMethods<never>,
        Computed=DefaultComputed,
        Props=DefaultProps
    >(path: string, component: VueComponent<Data, Methods, Computed, Props>): Route;
    public group(options: RouteGroupOptions, routes: Function): void;

    public all(): RouteConfig[];

    protected _addRoute<
        Data=DefaultData<never>,
        Methods=DefaultMethods<never>,
        Computed=DefaultComputed,
        Props=DefaultProps
    >(path: string, key: string, value: VueComponent<Data, Methods, Computed, Props>): Route;
    protected _updateGroupStack(options: RouteGroupOptions): void;
}

export default Routisan;
