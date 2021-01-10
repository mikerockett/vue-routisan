<img src="https://rockett.pw/git-assets/vue-routisan/logo.svg" alt="Vue Routisan" width="250">

# Upgrade Guide

## `v3.0.0-alpha.*` or `v3.0.0-beta.1`

In the first v3 alpha, a `fallback` option was introduced to provide a clean syntax for defining a catch-all route. However, Vue Router 4 removed catch-alls and replaced them with named regex-based paramaters.

Given that Routisan does not force a specific version of Vue Router (it does not depend on it, nor does it make it a peer dependency), it is unable to determine the correct course of action for fallback routes.

### Migration Path

In the unlikely event that you are using Routisan 3 alpha or beta in a production project and making use of fallbacks, you will need to revert to a normal route that handles this:

```diff
-- Route.fallback('PageNotFound')
++ Route.view('/:fallback(.*)*', 'PageNotFound')
```

If you prefer the [curly syntax](https://vue-routisan.rockett.pw/guide/parameter-matching.html#alternative-curly-syntax):

```js
Route.view('/{fallback}(.*)*', 'PageNotFound')
```

At a later stage, Routisan may introduce Vue Router 4 as a peer dependency, at which time `fallback` may become available again.

## `v2.x` → `v3.0.0-alpha.1`

### Importing `Route`

`Route` is now a named export:

```diff
-- import Route from 'vue-routisan'
++ import { Route } from 'vue-routisan'
```

### View Resolvers

Calls to `Route.setViewResolver` must be changed to `Factory.usingResolver`:

```diff
-- Route.setViewResolver(view => () => import(`@/views/${view}`))
++ Factory.usingResolver(view => () => import(`@/views/${view}`))
```

### Compiled Routes

`Route.all()` has been replaced with `Factory.routes()`:

```diff
-- new Router({
--   routes: Route.all()
++   routes: Factory.routes()
-- })
```

If you are using Vue Router 4, the syntax for creating routers has changed:

```js
import { createRouter, createWebHistory } from 'vue-router'

createRouter({
  history: createWebHistory(),
  routes: Factory.routes(),
})
```

### Named Views

These are now declared as an optional third argument to `view`:

```diff
-- Route.view('path', {
--   default: 'DefaultComponent',
--   other: 'OtherComponent',
-- })
++ Route.view('path', 'DefaultComponent', {
++   other: 'OtherComponent',
++ })
```

### Named Routes

In v2, named routes did not cascade to their child routes, which meant redeclaring the parent name in each child, where necessary.

```diff
    Route.view('parent', 'Parent').name('parent').children(() => {
--    Route.view('child', 'Child').name('parent.child')
++    Route.view('child', 'Child').name('child')
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

> ⚠️ This has been removed in Beta 2

If you were declaring a catch-all/fallback route, you may now take advantage of the `fallback` method:

```js
Route.fallback('PageNotFound')
```

If you need dedicated fallbacks for different type of routes, you'll need to stick to the `view` method:

```js
Route.view('users/*', 'UserRouteNotFound')
```

**Vue Router Reference:** [router.vuejs.org/guide/essentials/dynamic-matching.html](https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route)

### Route Options

Per the [changelog](changelog.md), route options are no longer supported. Instead, use the applicable methods to set up your routes. These include:

- `meta(key, value)`
- `props(object)`
- `prop(key, value)` (defers to `props`)
- `guard` (now fully replaces the old `beforeEnter` option)
