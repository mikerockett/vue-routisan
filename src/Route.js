import { fixSlashes } from './util';
import setters from './setters';

export default class Route {
    constructor (path, key, value) {
        this.config = { path: fixSlashes(path) };
        this._set(key, value);
        this._guards = [];
    }

    options (options) {
        const valid = [
            'name', 'components', 'redirect', 'props', 'alias',
            'children', 'beforeEnter', 'meta', 'caseSensitive',
            'pathToRegexpOptions', 'guard', 'prefix'
        ];

        Object.keys(options)
            .filter((key) => valid.includes(key))
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
        const aliases = {
            guard: 'beforeEnter'
        };

        const paths = ['redirect', 'alias', 'prefix'];

        if (Object.keys(aliases).includes(key)) {
            key = aliases[key];
        }

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
