import Route from "./Route";
import { RouteGuard } from "./types";

declare const setters: {
    component($this: Route, component: VueComponent): void,
    beforeEnter($this: Route, guard: RouteGuard): void,
    children($this: Route, routes: Function): void;
    prefix($this: Route, prefix: string): void;
};

export default setters
