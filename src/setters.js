import { fixSlashes, getArray, multiguard } from './util';
import shared from './shared';

export default {
    component ($this, component) {
        $this.config.component = shared.resolver(component);
    },
    beforeEnter ($this, guard) {
        guard = getArray(guard);

        $this._guards = $this._guards.concat(guard);

        $this.config.beforeEnter = multiguard($this._guards);
    },
    children ($this, routes) {
        shared.root = false;

        routes();

        $this.config.children = shared.childRoutes.map((route) => route.config);

        shared.childRoutes = [];

        shared.root = true;
    },
    prefix ($this, prefix) {
        $this.config.path = fixSlashes([prefix, $this.config.path]);
    }
};
