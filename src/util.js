import shared from './shared';

export const fixSlashes = (path) => {
    if (!['/', '*'].includes(path)) {
        if (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        if (!path.startsWith('/') && shared.root) {
            path = '/' + path;
        }
    }
    return path;
};

export { default as multiguard } from 'vue-router-multiguard';
