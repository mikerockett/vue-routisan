import { fixSlashes, multiguard } from './util';

export default class Route {
    constructor (path) {
        this.config = { path: fixSlashes(path) };
        this._guards = [];
    }

    options (options) {
        const valid = [
            'name', 'components', 'redirect', 'props', 'alias',
            'children', 'beforeEnter', 'meta', 'caseSensitive',
            'pathToRegexpOptions', 'as', 'guard', 'prefix'
        ];
        const aliases = {
            as: 'name',
            guard: 'beforeEnter'
        };
        const paths = ['redirect', 'alias', 'prefix'];

        valid.forEach((key) => {
            let value = options[key];
            if (options.hasOwnProperty(key)) {
                if (Object.keys(aliases).includes(key)) {
                    key = aliases[key];
                }
                if (paths.includes(key)) {
                    value = fixSlashes(value);
                }
                this._set(key, value);
            }
        });
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
