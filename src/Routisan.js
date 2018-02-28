import Route from './Route';

export default class Routisan {
    constructor (root = true) {
        this._root = root;
        this._resolver = (component) => component;
        this._routes = [];
        this._groupStack = {};
    }

    setViewResolver (resolver) {
        this._resolver = resolver;
    }

    _addRoute (path, key, value) {
        const route = new Route(path, key, value, this._root);

        route.options(this._groupStack);

        this._routes.push(route);

        return route;
    }

    view (path, component) {
        return this._addRoute(path, 'component', this._resolver(component));
    }

    redirect (path, redirect) {
        return this._addRoute(path, 'redirect', redirect);
    }

    group (options, routes) {
        this._groupStack = options;

        routes();

        this._groupStack = {};
    }

    nested (path, component, children) {
        const route = this._addRoute(path, 'component', this._resolver(component));
        const nestedRoutisan = new Routisan(false);
        nestedRoutisan.setViewResolver(this._resolver);

        children(nestedRoutisan);

        route.options({
            children: nestedRoutisan.all()
        });
    }

    all () {
        return this._routes.map((route) => route.config);
    }
}
