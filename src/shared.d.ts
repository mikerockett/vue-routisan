import Route from "./Route";
import { ComponentResolver } from "./types";

declare const shared: {
    resolver: ComponentResolver,
    childStack: Route[],
    isRoot(): boolean,
};

export default shared
