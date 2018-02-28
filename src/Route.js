import { fixSlashes, multiguard } from './util';

export default class Route {
    constructor (path, key, value, root = true) {
        this.config = { path: root ? fixSlashes(path) : path };
        this._set(key, value);
        this._guards = [];
    }

    options (options) {
        const valid = [
            'name', 'components', 'redirect', 'props', 'alias',
            'children', 'beforeEnter', 'meta', 'caseSensitive',
            'pathToRegexpOptions', 'as', 'guard', 'prefix'
        ];

        Object.keys(options)
            .filter((key) => valid.includes(key))
            .forEach((key) => this._set(key, options[key]));

        return this;
    }

    as (name) {
        this._set('name', name);
        return this;
    }

    guard (guard) {
        this._set('beforeEnter', guard);
        return this;
    }

    _set (key, value) {
        const aliases = {
            as: 'name',
            guard: 'beforeEnter'
        };

        const paths = ['redirect', 'alias', 'prefix'];

        if (Object.keys(aliases).includes(key)) {
            key = aliases[key];
        }

        if (paths.includes(key)) {
            value = fixSlashes(value);
        }

        const method = '_' + key;

        if (this[method]) {
            this[method](value);
        } else {
            this.config[key] = value;
        }
    }

    _beforeEnter (guard) {
        guard = (Array.isArray(guard) ? guard : [guard]);

        this._guards = this._guards.concat(guard);

        this.config.beforeEnter = multiguard(this._guards);
    }

    _prefix (prefix) {
        this.config.path = fixSlashes(prefix + this.config.path);
    }
}
