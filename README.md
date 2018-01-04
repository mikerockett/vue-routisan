# vue-routisan

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-routisan.svg?style=flat-square)](https://www.npmjs.com/package/vue-routisan)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![donate](https://img.shields.io/badge/$-donate-ff5f5f.svg?style=flat-square)](https://ko-fi.com/raniesantos)

Elegant route definitions for **Vue Router**. Based on Laravel routing system.

___
## Install

You can install this package via yarn (or npm):

```bash
$ yarn add vue-routisan
```

___
## Usage

### Setting the view resolver

A view resolver is a callback function that should return a Vue component. Setting this allows the `view()` method to automatically require components for your routes. This saves you from having repetitive `import`s and `require`s in the file where you define your routes. 

```js
import Route from 'vue-routisan';

Route.setViewResolver((component) => {
    return require('./views/' + component);
});
```

### Basic usage

The `view()` method receives the `path` and `component` route options respectively. If you defined a **view resolver**, you may directly specify the name of the component.

Reference: [Vue route options](https://router.vuejs.org/en/api/options.html)

```js
Route.view('/', 'Home');
```

### Redirect routes

The `redirect()` method receives the `path` and `redirect` route options respectively.

```js
Route.redirect('/home', '/');
```

**NOTE:** The methods `view()` and `redirect()` both return a *route instance*.

### Named routes

The `as()` method sets the `name` option on the *route instance*.

```js
Route.view('/user/profile', 'Profile').as('profile');
```

### Navigation guards

The `guard()` method sets the `beforeEnter` option on the *route instance*.

```js
const auth = (to, from, next) => { /* must be logged in */ };
const admin = (to, from, next) => { /* user must be admin */ };

Route.view('/account/settings', 'Settings').guard(auth);
```

You may also provide an array of guards. They will be executed in the order they are listed in the array.

This applies not only to the `guard()` method, you can do this with any of the methods below that can apply navigation guards to routes.

```js
Route.view('/admin/dashboard', 'Dashboard').guard([auth, admin]);
```

### Setting other route options

Use the `options()` method to set all other options on the *route instance*.

**NOTE:** This will not override the `path` and `component` options. They will be ignored if you specify them.

Reference: [Vue route options](https://router.vuejs.org/en/api/options.html)

```js
const guest = (to, from, next) => { /* already logged in */ };

Route.view('/auth/signin', 'Signin').options({
    name: 'login',
    beforeEnter: guest
});
```

### Aliased options

Some options have aliases for consistency with method names.

```js
Route.view('/auth/signup', 'Signup').options({
    as: 'register', // alias for 'name'
    guard: guest    // alias for 'beforeEnter'
});
```

### Route groups

Allows you to apply route options to multiple routes.

```js
Route.group({ beforeEnter: guest }, () => {
    Route.view('/auth/password/forgot', 'Forgot');
    Route.view('/auth/password/reset', 'Reset');
});
```

**NOTE:** Navigation guards defined for the group will take priority over guards defined on the individual routes in the callback.

### Route prefixes

Add a prefix to the `path` of each route in a group.

```js
Route.group({ prefix: '/posts' }, () => {
    Route.view('/', 'PostIndex');        // '/posts'
    Route.view('/create', 'CreatePost'); // '/posts/create'
    Route.view('/edit', 'EditPost');     // '/posts/edit'
});
```

### A note on slashes

Options such as `path`, `redirect`, `alias`, and `prefix` are automatically formatted.

```js
'/'                // '/'
'products'         // '/products'
'categories/'      // '/categories'
'shop/checkout'    // '/shop/checkout'
'password/change/' // '/password/change'
```

### Retrieve all routes

`Route.all()` returns an array of all the defined routes.

#### router/routes.js

```js
import Route from 'vue-routisan';

// define view resolver

// define routes

export default Route.all();
```

#### router/index.js

```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: routes
});
```

___
## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
