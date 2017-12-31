import { fixSlashes } from './util';

export default class Route {
    constructor (path) {
        this.path = fixSlashes(path);
        this._guards = [];
    }

    options (options) {
        const keys = {
            default: [
                'name',
                'components',
                'redirect',
                'props',
                'alias',
                'children',
                'beforeEnter',
                'meta',
                'caseSensitive',
                'pathToRegexpOptions'
            ],
            custom: ['as', 'guard', 'prefix']
        };
        const handler = (options, keys, callback) => {
            const paths = ['redirect', 'alias', 'prefix'];
            keys.forEach((key) => {
                if (options.hasOwnProperty(key)) {
                    const value = (paths.includes(key) ? fixSlashes(options[key]) : options[key]);
                    callback(key, value);
                }
            });
        };
        handler(options, keys.custom, (key, value) => { this[key](value); });
        handler(options, keys.default, (key, value) => { this[key] = value; });
        return this;
    }

    as (name) {
        this.name = name;
        return this;
    }

    guard (guard) {
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

        return this;
    }

    prefix (prefix) {
        this.path = fixSlashes(prefix + this.path);
        return this;
    }
}
