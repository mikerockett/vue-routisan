import { fixSlashes } from './util';

export default class Route {
    constructor (path) {
        this.path = fixSlashes(path);
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
        this.beforeEnter = guard;
        return this;
    }

    prefix (prefix) {
        this.path = fixSlashes(prefix + this.path);
        return this;
    }
}
