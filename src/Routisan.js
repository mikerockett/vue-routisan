import Route from './Route';
import shared from './shared';

export default class Routisan {
    constructor () {
        this._routes = [];
        this._groupStack = {};
    }

    setViewResolver (resolver) {
        shared.resolver = resolver;
    }

    _addRoute (path, key, value) {
        const route = new Route(path, key, value);

        route.options(this._groupStack);

        (shared.root ? this._routes : shared.childRoutes).push(route);

        return route;
    }

    view (path, component) {
        return this._addRoute(path, 'component', component);
    }

    redirect (path, redirect) {
        return this._addRoute(path, 'redirect', redirect);
    }

    group (options, routes) {
        this._groupStack = options;

        routes();

        this._groupStack = {};
    }

    all () {
        return this._routes.map((route) => route.config);
    }
}
