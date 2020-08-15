<img src="https://rockett.pw/git-assets/vue-routisan/logo.svg" alt="Vue Routisan" width="250">

# Upgrade Guide

## `v2.x` → `v3.0.0-alpha.1`

### Importing `Route`

`Route` is now a named export:

**Before:**

```js
import Route from 'vue-routisan'
```

**After:**

```js
import { Route } from 'vue-routisan'
```

### View Resolvers

Calls to `Route.setViewResolver` must be changed to `Factory.usingResolver`:

```js
import { Factory } from 'vue-routisan'
Factory.usingResolver(view => () => import(`@/views/${view}`))
```

### Compiled Routes

`Route.all()` has been replaced with `Factory.routes()`:

```js
new Router({
  routes: Factory.routes()
})
```

### Named Views

These are now declared as an optional third argument to `view`:

**Before:**

```js
Route.view('path', {
  default: 'DefaultComponent',
  other: 'OtherComponent',
})
```

**After:**

```js
Route.view('path', 'DefaultComponent', {
  other: 'OtherComponent',
})
```

### Guards

Navigation-guarding is now done through a Promise-chain, which means an underlying Promise-based class must be used to build guards. These classes must extend Routisan's `Guard` and implement the `handle` method, used to resolve or reject the underlying Promise. This method also accepts the current route context as its third argument, in case your guard needs to reference those.

Here's a simple example of the transition:

> Whilst it's recommended to declare your guards in dedicated files, they are shown inline below for brevity.

**Before:**

```js
// Declaration:
const authenticated = (to, from, next) => {
  return isAuthenticated()
    ? next()
    : next({ name: 'login' })
}

// Usage:
Route.view('/account/settings', 'Settings').guard(auth);
```

**After:**

```js
// Declaration:
import { Guard } from 'vue-routisan'

class AuthenticationGuard extends Guard {
  handle(resolve, reject, { from, to }) {
    isAuthenticated()
      ? resolve()
      : reject({ name: 'login' }) // refer to the readme for more info.
  }
}

// Usage:
Factory.withGuards({ 'auth': AuthenticationGuard })
Route.view('/account/settings', 'Settings').guard('auth');
```

The method used to set more than one guard on a route has also changed. Previously, you would pass in an array to the `guard` method. Now, you may pass in an arbitrary number of arguments.

> Aliasing guards is also optional. If you pass in a guard without a name (as shown with the `AdminGuard` below), the class-name of the guard will be used instead.

```js
Factory.withGuards({
  'auth': AuthenticationGuard,
  AdminGuard,
})

Route.view('/account/settings', 'Settings').guard('auth', 'AdminGuard');
```

### Fallback Routes

If you were declaring a catch-all/fallback route, you may now take advantage of the `fallback` method:

```js
Route.fallback('PageNotFound')
```

If you need dedicated fallbacks for different type of routes, you'll need to stick to the `view` method:

```js
Route.view('users/*', 'UserRouteNotFound')
```

**Vue Router Reference:** [router.vuejs.org/guide/essentials/dynamic-matching.html](https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route)
