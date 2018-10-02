const shared = {
    resolver: (component) => component,
    childStack: [],
    isRoot () {
        return this.childStack.length === 0;
    }
};

export default shared;
