const shared = {
    resolver: (component) => component,
    stack: [],

    pushState: function () {
        this.stack.push({
            childRoutes: []
        });
    },
    popState: function () {
        return this.stack.pop();
    },
    /**
     * getState
     * @returns Object|undefined
     */
    getState: function () {
        return this.stack[this.stack.length - 1];
    },
    isRoot: function () {
        return !this.stack.length;
    }
};

export default shared;
