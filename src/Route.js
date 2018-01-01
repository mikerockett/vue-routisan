import { fixSlashes } from './util';

export default class Route {
    constructor (path) {
        this.path = fixSlashes(path);
        this._guards = [];
    }

    _set (key, value) {
        const method = '_' + key;
        if (this[method]) {
            this[method](value);
        } else {
            this[key] = value;
        }
    }

    options (options) {
        const valid = [
            'name',
            'components',
            'redirect',
            'props',
            'alias',
            'children',
            'beforeEnter',
            'meta',
            'caseSensitive',
            'pathToRegexpOptions',
            'as',
            'guard',
            'prefix'
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

    _beforeEnter (guard) {
        if (Array.isArray(guard)) {
            this._guards = this._guards.concat(guard);
        } else {
            this._guards.push(guard);
        }

        this.beforeEnter = (to, from, next) => {
            const destination = window.location.href;
            this._guards.forEach((guard) => {
                const redirected = (window.location.href !== destination);
                if (!redirected) {
                    guard(to, from, next);
                }
            });
        };
    }

    as (name) {
        this.name = name;
        return this;
    }

    guard (guard) {
        this._set('beforeEnter', guard);
        return this;
    }

    _prefix (prefix) {
        this.path = fixSlashes(prefix + this.path);
    }
}
