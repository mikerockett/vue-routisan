import { fixSlashes } from './util';

export default class Route {
    constructor (path) {
        this.path = fixSlashes(path);
        this._guards = [];
        this._setters = {
            beforeEnter (guard) {
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
            },
            prefix (prefix) {
                this.path = fixSlashes(prefix + this.path);
            }
        };
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
                // swap alias
                if (Object.keys(aliases).includes(key)) {
                    options[aliases[key]] = value;
                    delete options[key];
                }
                // format paths
                if (paths.includes(key)) {
                    value = fixSlashes(value);
                }
                // set
                if (this._setters.hasOwnProperty(key)) {
                    this._setters[key](value);
                } else {
                    this[key] = value;
                }
            }
        });
        return this;
    }

    as (name) {
        this.name = name;
        return this;
    }

    guard (guard) {
        this._setters.beforeEnter(guard);
        return this;
    }
}
