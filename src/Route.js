import { fixSlashes, filterOptions } from './util';
import setters from './setters';

export default class Route {
    constructor (path, key, value) {
        this.config = { path: fixSlashes(path) };
        this._set(key, value);
        this._guards = [];
    }

    options (options) {
        options = filterOptions(options, [
            'name', 'components', 'redirect', 'props',
            'alias', 'children', 'beforeEnter', 'meta',
            'caseSensitive', 'pathToRegexpOptions', 'prefix'
        ]);

        Object.keys(options)
            .forEach((key) => this._set(key, options[key]));

        return this;
    }

    name (name) {
        this._set('name', name);
        return this;
    }

    guard (guard) {
        this._set('beforeEnter', guard);
        return this;
    }

    children (routes) {
        this._set('children', routes);
        return this;
    }

    _set (key, value) {
        const paths = ['redirect', 'alias', 'prefix'];

        if (paths.includes(key) && typeof value === 'string') {
            value = fixSlashes(value);
        }

        if (setters.hasOwnProperty(key)) {
            setters[key](this, value);
        } else {
            this.config[key] = value;
        }
    }
}
