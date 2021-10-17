import { RouteOptions, RouteGuard, RouteGroup } from "./shared";
export { default as multiguard } from 'vue-router-multiguard';

export declare function arrayWrap<T>(value: T | T[]): T[];

export declare function arrayLast<T>(items: T[]): T|undefined;

export declare function fixSlashes(path: string): string;

declare function swapGuardKey(options: RouteOptions): Exclude<RouteOptions, {guard?: RouteGuard}> & { beforeEnter?: RouteGuard };

export declare function filterOptions<Keys extends readonly any[]>(options: RouteOptions, keys: Keys): Exclude<RouteOptions, {
    [Key in Keys[number]]: RouteOptions[Key]
}>;

declare function margePrefix($new: RouteGroup, $old: RouteGroup): string;

declare function mergeGuard($new: RouteGroup, $old: RouteGroup): RouteGuard[];

export declare function groupMerge($new: RouteGroup, $old: RouteGroup): RouteGroup;
