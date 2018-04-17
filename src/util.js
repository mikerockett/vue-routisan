import shared from './shared';

export { default as multiguard } from 'vue-router-multiguard';

export const getArray = (item) => (Array.isArray(item) ? item : [item]);

export const fixSlashes = (path) => {
    if (!['/', '*'].includes(path)) {
        path = getArray(path)
            .map((path) => path.replace(/^\/+|\/+$/g, ''))
            .join('/');
        path = (shared.root ? `/${path}` : path);
    }

    return path;
};

const swapGuardKey = (options) => {
    if (options.hasOwnProperty('guard')) {
        options.beforeEnter = options.guard;
        delete options.guard;
    }

    return options;
};

export const filterOptions = (options, keys) => {
    Object.keys(swapGuardKey(options)).forEach((key) => {
        if (!keys.includes(key)) {
            delete options[key];
        }
    });

    return options;
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
