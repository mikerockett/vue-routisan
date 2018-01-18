import { fixSlashes, multiguard } from './util';

export default class Route {
    constructor (path) {
        this.config = { path: fixSlashes(path) };
        this._guards = [];
    }

    options (options) {
        if (Object.keys(options).length === 0) {
            return;
        }
        const valid = [
            'name', 'components', 'redirect', 'props', 'alias',
            'children', 'beforeEnter', 'meta', 'caseSensitive',
            'pathToRegexpOptions', 'as', 'guard', 'prefix'
        ];

        valid.forEach((key) => {
            const value = options[key];
            if (options.hasOwnProperty(key)) {
                this.set(key, value);
            }
        });
        return this;
    }

    as (name) {
        this.set('name', name);
        return this;
    }

    guard (guard) {
        this.set('beforeEnter', guard);
        return this;
    }

    set (key, value) {
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
