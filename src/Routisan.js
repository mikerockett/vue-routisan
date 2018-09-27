import Route from './Route';
import shared from './shared';
import { groupMerge, filterOptions } from './util';

export default class Routisan {
    constructor () {
        this._routes = [];
        this._groupStack = [];
    }

    setViewResolver (resolver) {
        shared.resolver = resolver;
    }

    _addRoute (path, key, value) {
        const route = new Route(path, key, value);

        if (this._groupStack.length) {
            route.options(this._groupStack.slice().reverse()[0]);
        }

        (shared.isRoot() ? this._routes : shared.getState().childRoutes).push(route);

        return route;
    }

    view (path, component) {
        return this._addRoute(path, 'component', component);
    }

    redirect (path, redirect) {
        return this._addRoute(path, 'redirect', redirect);
    }

    group (options, routes) {
        this._updateGroupStack(options);

        routes();

        this._groupStack.pop();
    }

    _updateGroupStack (options) {
        options = filterOptions(options, ['beforeEnter', 'prefix']);

        if (this._groupStack.length) {
            options = groupMerge(options, this._groupStack.slice().reverse()[0]);
        }

        this._groupStack.push(options);
    }

    all () {
        return this._routes.map((route) => route.config);
    }
}
