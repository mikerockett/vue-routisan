export const fixSlashes = (path) => {
    if (!['/', '*'].includes(path)) {
        if (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
    }
    return path;
};
