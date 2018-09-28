const shared = {
    resolver: (component) => component,
    stack: [],
    isRoot () {
        return this.stack.length === 0;
    },
    pushState () {
        this.stack.push({
            childRoutes: []
        });
    },
    popState () {
        return this.stack.pop();
    },
    getState () {
        return this.stack.slice(-1)[0];
    }
};

export default shared;
