import shared from './shared';

export { default as multiguard } from 'vue-router-multiguard';

export const getArray = (item) => (Array.isArray(item) ? item : [item]);

export const fixSlashes = (path) => {
    if (!['/', '*'].includes(path)) {
        path = path.replace(/^\/+|\/+$/g, '');
        path = (shared.root ? `/${path}` : path);
    }
    return path;
};

const swapGuardKey = (options) => {
    const obj = Object.assign({}, options);
    if (obj.hasOwnProperty('guard')) {
        obj.beforeEnter = obj.guard;
        delete obj.guard;
    }
    return obj;
};

export const filterOptions = (options, keys) => {
    options = swapGuardKey(options);
    return keys.filter((key) => Object.keys(options).includes(key))
        .reduce((filtered, key) => {
            if (options.hasOwnProperty(key)) {
                filtered[key] = options[key];
            }
            return filtered;
        }, {});
};

const mergePrefix = ($new, $old) => {
    $old = ($old.hasOwnProperty('prefix') ? $old.prefix : '');

    return ($new.hasOwnProperty('prefix') ? $old + fixSlashes($new.prefix) : $old);
};

const mergeGuard = ($new, $old) => {
    $old = ($old.hasOwnProperty('beforeEnter') ? getArray($old.beforeEnter) : []);

    return ($new.hasOwnProperty('beforeEnter') ? $old.concat(getArray($new.beforeEnter)) : $old);
};

export const groupMerge = ($new, $old) => {
    return {
        beforeEnter: mergeGuard($new, $old),
        prefix: mergePrefix($new, $old)
    };
};
