import Route from './Route';

export default class Routisan {
    constructor () {
        this._viewResolver = (component) => component;
        this._routes = [];
        this._groupOptions = {};
    }

    setViewResolver (resolver) {
        this._viewResolver = resolver;
    }

    _createRoute (path, callback) {
        const route = new Route(path);
        callback(route);
        route.options(this._groupOptions);
        this._routes.push(route);
        return route;
    }

    view (path, component) {
        return this._createRoute(path, (route) => {
            route.component = this._viewResolver(component);
        });
    }

    redirect (path, redirect) {
        return this._createRoute(path, (route) => {
            route.options({ redirect });
        });
    }

    group (options, routesCallback) {
        this._groupOptions = options;
        routesCallback();
        this._groupOptions = {};
    }

    all () {
        return this._routes;
    }
}
