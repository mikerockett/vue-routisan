<img src="https://rockett.pw/git-assets/vue-routisan/logo.svg" alt="Vue Routisan" width="250">

Elegant, fluent route definitions for [Vue Router](https://router.vuejs.org/), inspired by [Laravel](https://laravel.com).</p>

![Release 3.x](https://rockett.pw/git-assets/vue-routisan/release-3x.badge.svg)
![Made with JavaScript](https://rockett.pw/git-assets/badges/javascript.badge.svg)
![Gluten Free](https://rockett.pw/git-assets/badges/gluten-free.badge.svg)
![Built with ♥](https://rockett.pw/git-assets/badges/with-love.badge.svg)

![`npm i vue-routisan // yarn add vue-routisan`](https://rockett.pw/git-assets/vue-routisan/install.badge.svg)

---

- [Get Started](#get-started)
- [View Resolution](#view-resolution)
- [Basic Routes](#basic-routes)
  - [Named Views](#named-views)
  - [Named Routes](#named-routes)
- [Redirects](#redirects)
- [Fallbacks and Asterisks](#fallbacks-and-asterisks)
- [Aliasing Routes](#aliasing-routes)
- [Parameter Matching](#parameter-matching)
  - [Advanced Pattern Matching](#advanced-pattern-matching)
- [Nesting Routes](#nesting-routes)
- [Grouping Routes](#grouping-routes)
- [Grouping and Nesting Routes](#grouping-and-nesting-routes)
- [Navigation Guards](#navigation-guards)
  - [Defining Guards](#defining-guards)
  - [Registering Guards](#registering-guards)
  - [Using  Guards](#using-guards)
  - [Multiple Guards](#multiple-guards)
  - [Guarding Nested Routes](#guarding-nested-routes)
  - [Guarding Grouped Routes](#guarding-grouped-routes)

---

Routisan provides you with a friendlier way to declare route definitions for Vue Router. Inspired by Laravel, it uses chained calls to build up your routes, allowing you to group and nest as deeply as you like.

```js
Route.view('blog', 'Blog').name('blog').children(() => {
  // All Posts
  Route.view('/', 'Blog/Posts').name('posts')

  // Single Post
  Route.view('{post}', 'Blog/Post').name('single-post').children(() => {
    Route.view('edit', 'Blog/Post/Edit').name('edit')
    Route.view('stats', 'Blog/Post/Stats').name('stats')
  })
})
```

This produces an array of routes in the format Vue Router expects to see, and follows a behaviour somewhat similar to Laravel’s router, such as:

- Using callbacks to iteratively collect routes
- Correctly joining nested routes together, regardles of prefixed slashes
- Correctly joining the names of nested routes, using a separator of your choice

**The above example produces the following route definitions:**

| Path              | Component                                    | Name                   |
| ----------------- | -------------------------------------------- | ---------------------- |
| /blog             | Blog/Posts (rendered within Blog)            | blog.posts             |
| /blog/:post/edit  | Blog/Posts/Edit (rednered within Blog/Post)  | blog.single-post.edit  |
| /blog/:post/stats | Blog/Posts/Stats (rednered within Blog/Post) | blog.single-post.stats |

## Get Started

Made up of two primary components, `Route` and `Factory`, Routisan is really easy to use. Simply declare your routes and add them to the Vue Router instance:

```js
import Vue from 'vue'
import Router from 'vue-router'
import { Route, Factory } from 'vue-routisan'

// Install VueRouter
Vue.use(Router)

// Define your routes…

// Export a new router with Routisan’s routes applied.
export const router = new Router({
  mode: 'history',
  routes: Factory.routes()
})
```

## View Resolution

Before we dive into the sugary goodness, let’s talk about view resolution. Simply put, Routisan allows you to define a custom view resolver function that will be called when resolving the components for your routes. By default, the resolver will simply return the view, as provided in your route definition, which means you need to resolve the rendered component yourself:

```js
import { Route } from 'vue-routisan'
import Home from '@/views/Home'

Route.view('/', Home)
```

More often than not, though, you’ll want to avoid two things:

1. `import` repetition
2. Non-async components bloating up your bundle

To do this, you can make use of Vue Router’s async component syntax by either passing an async import function to each route, or by giving the Factory a resolver function:

**Passing in manually:**

```js
import { Route } from 'vue-routisan'

Route.view('/', () => import('@/views/Home'))
```

**Defining a resolver function (recommended method):**

```js
import { Route, Factory } from 'vue-routisan'

Factory.usingResolver(path => () => import(`@/views/${path}`))
Route.view('/', 'Home')
```

This approach is recommended as you only need to declare the resolver once, and Routisan will use it for every single route you define.

With that out of the way, let’s jump into the basics. Going forward, we’ll assume that a resolver is being used, just to simplify the examples.

## Basic Routes

As shown above, a simple route is comprised of a `path` and a `view`, passed in via `Route.view()`, which returns a new `Route` instance.

To expand on that, Routisan will automatically sanitize slashes on your behalf, injecting them where they’re needed, and removing them where they’re not (this includes removing extra consecutive slashes).

```js
Route.view('about', 'About')
Route.view('/company/', 'Company')
```

These two routes will be compiled as `/about` and `/company`, respectively.

When you use nested routes, the leading slashes will automatically be omitted – more on that in the “Nesting Routes” section.

### Named Views

If you’re using [named views](https://router.vuejs.org/guide/essentials/named-views.html), you’ll want to declare additional views that VueRouter will render. This can be done with the optional third argument, `additionalViews`:

```js
Route.view('about', 'About', {
  sidebar: 'Sidebars/About',
  navigator: 'Navigators/About'
})
```

Internally, Routisan does not provide the `component` key to the compiled route. Rather, it provides a `components` key, and always sets the `default` to the provided second argument. By doing this, we simplify the compilation process, where an additional check is no longer required.

### Named Routes

Support for [named routes](https://router.vuejs.org/guide/essentials/named-routes.html) is baked into Routisan, using the `name()` method on an existing `Route` instance:

```js
Route.view('account', 'ManageAccount').name('manage-account')
```

To expand on this functionality, Routisan introduces similar behaviour that comes from Laravel’s router, where nested names are automatically cascaded, using the character-separator of your choice (defaults to a `.`). Unlike Laravel, however, you do not need to suffix the parent name with the separator – this will be done for you. More on this in the “Nesting Routes” section.

If you’d like to use a different character-separator, you can define that character in the Factory:

```js
Factory.withNameSeparator('-')
```

##  Redirects

To perform a simple redirect from one route to another, you can use the `redirect()` method on the Route builder:

```js
Route.redirect('home', '/')
Route.redirect('home', { name: 'home' })
Route.redirect('home', (to) => /** Return the path or location to redirect to */)
```

## Fallbacks and Asterisks

Akin to a 404, a fallback route is simply registered in the case a requested route does not exist. These can be registered using the `fallback()` helper method:

```js
Route.fallback('ViewNotFound')
```

However, If you need dedicated fallbacks for different type of routes, you'll need to stick to the `view` method and use the `*` wildcard, as prescribed by VueRouter:

```js
Route.view('users/*', 'UserRouteNotFound')
```

## Aliasing Routes

To make a route accessible from two URIs, simply use the `alias()` method on an existing Route instance:

```js
Route('about', 'About').alias('about-us')
```

> The `About` view will now be available to both `/about` and `/about-us`.

## Parameter Matching

When adding paramaters to routes in VueRouter, you are limited to the `:colon` format. In making Routisan align with Laravel’s router a little more, you can now also use the `{curly}` format.

When using curlies, please be aware that joining two parameters together will result in their separation into two segments. As an example, `{a}{b}` will be compiled to `:a/:b`. This will not happen when using the colon syntax, however, as that would be a destructive change at router-level.

**Optional parameters** may be defined by placing the question-mark outside of the curlies. Ex, `{user}?` is compiled to `:user?`.

### Advanced Pattern Matching

VueRouter supports all the patterns and features that [path-to-regexp](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0#parameters) supports. This includes the ability to add regular expressions to your routes.

One such example, though uncommon, is the catch-anything `(.*)`. To make this a little more clear, you can use `{all}` in place of this expression. The behaviour doesn’t change, however – you cannot access `all` as a parameter.

Additional notes:

- **Constraining parameters** to expressions is done by placing them outside of the curlies. Ex, `{user}(\\d+)` is compiled to `:user(\\d+)`.
- **Aliased constraints** for numbers and strings are available: Ex, `user/{user}(number)` is compiled to `user/:user(\\d+)` and `posts/{slug}(string)` is compiled to `posts/:slug(\\w+)`

## Nesting Routes

Routisan provides a fluent API for nesting your routes as *children* by using a callback passed to the route instance’s `children()` method. Naturally, you can nest as deeply as you like. Let’s expand on the last example by adding a few more account-management routes:

```js
Route.view('account', 'AccountView').children(() => {
  Route.view('/', 'ManageAccount')
  Route.view('/emails', 'ManageEmails')
})
```

Here, `AccountView` would be the view that contains the `<router-view />` for child routes.

> **Leading slashes** will be removed from child routes, otherwise the route path above would simply be `/emails`, not `/account/emails`. The aim here is to compile routes according to natural expectations of the tree-structure provided.

As indicated above, you can cascade route names, without needed to re-define the prefix of a nested name. Expanding on the above example:

```js
Route.view('account', 'AccountView').name('account').children(() => {
  Route.view('/', 'ManageAccount').name('manage')
  Route.view('/emails', 'ManageEmails').name('emails')
})
```

This would produce a set of routes with the following names:

- `/account` → `account.manage`
- `/account/emails` → `account.emails`

## Grouping Routes

VueRouter doesn’t understand the concept of grouping routes – it only knows how to nest. By providing an abstraction layer on top of VueRouter, we can add the ability to group routes, which allows you to set names, prefixes, and guards (more on that to follow) for each route declared in the callback passed to `group()` on an existing Route instance.

The `group()` method takes two arguments: the first is an options object, and the second is the callback that defines new routes within the group.

Here’s a simple example that sets a **prefix** and a **name** on the grouped routes:

```js
Route.group({ prefix: 'contact', name: 'contact' }, () => {
  Route.view('details', 'Contact/Details').name('details')
  Route.view('map', 'Contact/Map').name('map')
})
```

This will generate two routes that are independent of one another, not compiled as *children* of `contact`:

- `/contact/details`
- `/contact/map`

As with nested routes, the names will automatically cascade, much like the prefix will cascade.

## Grouping and Nesting Routes

Sometimes, you might find that you want to mix nesting and grouping together – Routisan supports this out of the box:

```js
Route.group({ prefix: 'account', name: 'account' }, () => {
  Route.view('/', 'ManageAccount').name('manage')

  Route.group({ prefix: 'subscription', name: 'subscription' }, () => {
    Route.view('/', 'ViewSubscription').name('view')
    Route.view('cancel', 'CancelSubscription').name('cancel')

    Route.view('upgrade', 'UpgradeSubscription').name('upgrade').children(() => {
      Route.group({ prefix: 'steps' }, () => {
        Route.view('select-new-plan', 'SelectNewPlan').name('select-new-plan')
        Route.view('review-payment-method', 'ReviewPaymentMethod').name('review-payment-method')
      })
    })
  })

  Route.view('cards', 'ManageCards').name('cards')
})
```

This is a relatively complex setup that would otherwise be quite verbose without the help of Routisan, which allows an infinite depth. It also knows to not apply prefixes where they are not needed. Specifically, this means that child routes within a group will not attain that group’s prefix, as VueRoute takes care of that part for you.

Once the compiled routes have been passed to VueRouter, you’d get the routes you expect:

- `/account`
- `/account/subscription`
- `/account/subscription/cancel`
- `/account/subscription/upgrade/steps/select-new-plan`
- `/account/subscription/upgrade/steps/review-payment-method`
- `/account/cards`

## Navigation Guards

Routisan provides a simple, Promise-based API for guarding your routes. This allows you to easily define your guards once and automatically have `beforeEach` handle them on your behalf.

In 2.x, guards were simple functions that you passed to `guard()` or `beforeEnter`. These were processed using `vue-router-multiguard`, which simply allowed you to provide more than one guard function to a route.

With 3.x, a more expressive API was introduced, which allowed for the removal of multiguard in favour of a more automated approach using classes and Promises.

### Defining Guards

To define a new guard, simply create a class that extends `Guard` and implements the `handle` method. Here’s a simple example:

```js
import { Guard } from 'vue-routisan'

class NavigationGuard extends Guard {
  handle(resolve, reject, { from, to }) {
    // resolve or reject based on a certain condition
  }
}
```

The instantiated class essentially wraps a Promise, which allows you to determine whether or not the user should be allowed to continue to the route, and then `resolve()` or `reject()` based on that.

A common example is to check whether or not the user is authenticated. If they need to sign in, then the guard needs to take them to a sign-in view:

```js
import { Guard } from 'vue-routisan'
import { isAuthenticated } from '@/services/auth'

class AuthenticationGuard extends Guard {
  handle(resolve, reject, { from, to }) {
    isAuthenticated()
      ? resolve()
      : reject({ name: 'auth.signin' })
  }
}
```

### Registering Guards

In order to apply a guard to a route, it must first be registered with the Factory:

```js
import { AuthenticationGuard } from '@/routing/guards/authentication-guard'

Factory.withGuards({
  AuthenticationGuard
})
```

If you would like to alias the name of the guard to something shorter, you can provide a key:

```js
Factory.withGuards({
  'auth': AuthenticationGuard
})
```

### Using  Guards

Once registered, you can attach the guard to the route using the `guard()` method on an existing Route instance:

```js
Route.view('change-password', 'ChangePassword').guard('AuthenticationGuard')
Route.view('change-password', 'ChangePassword').guard('auth') // if you registered with an alias
```

> Note how guards are referenced using strings, and not directly. Remember, guards are registered with the Factory, which will resolve the guard by name when it needs it.

### Multiple Guards

If you have registered and would like to use more than one guard, simply pass each one as an additional argument:

```js
Factory.withGuards({
  'auth': AuthenticationGuard,
  MustBeSuper
})

Route.view('user/:user/tokens/revoke', 'RevokeUserTokens').guard('auth', 'MustBeSuper')
```

### Guarding Nested Routes

To guard all the children of a route, simply set the guard on the parent route, and Routisan will automatically cascade them down to each child route. Expanding on a previous example:

```js
Route.view('account', 'AccountView').guard('auth').children(() => {
  Route.view('/', 'ManageAccount')
  Route.view('/emails', 'ManageEmails')
})
```

### Guarding Grouped Routes

Likewise, you can guard a group of routes by providing the `guard` key to the group’s options. Provide either a string or an array of guards to apply to all routes in the group:

```js
Route.group({ prefix: 'billing', name: 'billing', guard: 'auth' /** or guard: ['auth', 'otp-ok'] */ }, () => {
  Route.view('history', 'Billing/History').name('history')
  Route.view('payment-methods', 'Billing/PaymentMethods').name('payment-methods')
})
```

**Work in progress…**
