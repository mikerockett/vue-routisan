export { RouteConfig, Route as VueRoute, NavigationGuard as RouteGuard } from "vue-router";

import { Component, AsyncComponent } from "vue";

export type EsModule<T> = T | { default: T };
export type DefaultData<V> = object | ((this: V) => object);
export type DefaultProps = Record<string, any>;
type DefaultMethods<V> =  { [key: string]: (this: V, ...args: any[]) => any };
type DefaultComputed = Record<string, any>;

export type VueComponent<
    Data=DefaultData<never>,
    Methods=DefaultMethods<never>,
    Computed=DefaultComputed,
    Props=DefaultProps
> = string|EsModule<Component<Data, Methods, Computed, Props>>|AsyncComponent<Data, Methods, Computed, Props>;

export type ComponentResolver = <
    Data=DefaultData<never>,
    Methods=DefaultMethods<never>,
    Computed=DefaultComputed,
    Props=DefaultProps
>(component: VueComponent<Data, Methods, Computed, Props>) => VueComponent<Data, Methods, Computed, Props>;

export interface RouteOptions extends RouteConfig {
    prefix?: string;
    guard?: RouteGuard;
    children?: VueRoute[];
}

export interface RouteGroupOptions extends RouteConfig {
    beforeEnter: RouteGuard[];
    prefix: string;
}
