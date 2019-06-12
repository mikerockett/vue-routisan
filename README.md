# I am unable to maintain this package anymore, if you want to continue development of this I am willing to transfer ownership on GitHub and NPM.

# <img src="https://user-images.githubusercontent.com/8528269/36801126-23dfb91e-1cec-11e8-850e-9f2f83db1f4a.png" alt="vue-routisan">

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-routisan.svg?style=flat-square)](https://www.npmjs.com/package/vue-routisan)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://oss.ninja/mit/raniesantos)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
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

The view resolver allows the `view()` method to automatically require components for your routes. This saves you from having repetitive `import`s and `require`s when defining routes.

**The view resolver is optional**. If you choose to not configure it, you can `import` a component and pass it directly as the 2nd parameter of the `view()` method.

```js
import Route from 'vue-routisan';

Route.setViewResolver((component) => {
    return require('./views/' + component).default;
});
```

### Basic usage

The `view()` method receives the `path` and `component` route options respectively. If you defined the **view resolver**, you may directly specify the name of the component.

Reference: [Vue route options](https://router.vuejs.org/en/api/options.html)

```js
Route.view('/', 'Home');
```

#### Without the view resolver

```js
import Home from './views/Home';

Route.view('/', Home);
```

### Redirect routes

The `redirect()` method receives the `path` and `redirect` route options respectively.

```js
Route.redirect('/home', '/');
```

**NOTE:** The methods `view()` and `redirect()` both return a *route instance*.

### Named routes

The `name()` method sets the `name` option on the *route instance*.

```js
Route.view('/user/profile', 'Profile').name('profile');
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

### Nested Routes

The `children()` method sets the `children` option on the *route instance*.

```js
Route.view('/user', 'User').children(() => {
    Route.view('', 'UserList');
    Route.view(':id', 'UserDetails');
    Route.view(':id/edit', 'UserEdit');
});
```

### Setting other route options

Use the `options()` method to set all other options on the *route instance*.

This method will not override the `path` and `component` options. They will be ignored if you specify them.

The `children` option expects a callback function instead of an array (See Nested Routes).

Reference: [Vue route options](https://router.vuejs.org/en/api/options.html)

```js
const guest = (to, from, next) => { /* already logged in */ };

Route.view('/auth/signin', 'Signin').options({
    name: 'login',
    beforeEnter: guest
});
```

`beforeEnter` has the alias `guard` for consistency with the `guard()` method.

```js
Route.view('/auth/signup', 'Signup').options({
    guard: guest // alias for 'beforeEnter'
});
```

### Route groups

Allows you to apply route options to multiple routes.

- Navigation guards defined for the group will take priority over guards defined on the individual routes in the callback.
- Route groups can be nested.

```js
Route.group({ beforeEnter: guest }, () => {
    Route.view('/auth/password/forgot', 'Forgot');
    Route.view('/auth/password/reset', 'Reset');
});
```

### Route prefixes

Add a prefix to the `path` of each route in a group.

```js
Route.group({ prefix: '/blog' }, () => {
    Route.group({ prefix: '/posts' }, () => {
        Route.view('/', 'PostIndex');        // '/blog/posts'
        Route.view('/create', 'CreatePost'); // '/blog/posts/create'
        Route.view('/edit', 'EditPost');     // '/blog/posts/edit'
    });
});
```

### Automatically formatted paths

Options such as `path`, `redirect`, `alias`, and `prefix` are automatically formatted.

Slashes will not be prepended to the paths of nested routes.

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
## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

___
## License

Released under the [MIT License](https://oss.ninja/mit/raniesantos).
