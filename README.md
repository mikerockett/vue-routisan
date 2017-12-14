# vue-routisan

[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]

Elegant route definitions for **Vue Router**. Based on Laravel routing system.

[Demo (CodeSandbox)](https://codesandbox.io/s/yvp14yo08x)

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

**NOTE:** I used this approach because because Webpack doesn't allow dynamic requires.

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
Route.view('/admin/dashboard', 'Home').as('dashboard');
```

### Navigation guards

The `guard()` method sets the `beforeEnter` option on the *route instance*.

```js
const auth = () => { /* redirect if not logged in */ };

Route.view('/account/settings', 'Settings').guard(auth);
```

### Setting other route options

Use the `options()` method to set all other options on the *route instance*.

**NOTE:** This will not override the `path` option. It will be ignored if you specify it.

Reference: [Vue route options](https://router.vuejs.org/en/api/options.html)

```js
const guest = () => { /* redirect if already logged in */ };

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
    guard: guest // alias for 'beforeEnter'
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

### Route prefixes

Add a prefix to the `path` of each route in a group.

```js
Route.group({ prefix: '/posts' }, () => {
    Route.view('/', 'PostIndex'); // '/posts'
    Route.view('/create', 'CreatePost'); // '/posts/create'
    Route.view('/edit', 'EditPost'); // '/posts/edit'
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

`router/routes.js`
```js
import Route from 'vue-routisan';

// define view resolver

// define routes

export default Route.all();
```

`router/index.js`
```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes
});
```

___
## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[npm-image]: https://img.shields.io/npm/v/vue-routisan.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/vue-routisan
[license-image]: https://img.shields.io/:license-mit-blue.svg?style=flat-square
[license-url]: LICENSE.md
