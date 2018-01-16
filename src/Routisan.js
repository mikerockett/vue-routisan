import Route from './Route';

export default class Routisan {
    constructor () {
        this._resolver = (component) => component;
        this._routes = [];
        this._groupStack = {};
    }

    setViewResolver (resolver) {
        this._resolver = resolver;
    }

    _addRoute (path, callback) {
        const route = new Route(path);
        callback(route);
        route.options(this._groupStack);
        this._routes.push(route);
        return route;
    }

    view (path, component) {
        return this._addRoute(path, (route) => {
            route.instance.component = this._resolver(component);
        });
    }

    redirect (path, redirect) {
        return this._addRoute(path, (route) => {
            route.options({ redirect });
        });
    }

    group (options, routes) {
        this._groupStack = options;
        routes();
        this._groupStack = {};
    }

    all () {
        return this._routes.map((route) => route.instance);
    }
}
