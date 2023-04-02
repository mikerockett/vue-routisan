## ⚠️ Retired and Archived

Vue Routisan is being retired in favour of a TypeScript rewrite under a new name, which is yet to be announced. This repository is being archived as a result.

The new package will employ the same principles of Routisan, however the interface will be simpler and a lot easier to digest, even for those with minimal Vue experience. When the new package is released, it is recommended that all users of v2 and v3 move to the new package. An migration guide will be made available when this happens. 

**Note:** The [current documentation site](https://vue-routisan.rockett.pw/) for v3 will remain available until such time as the new package has been released. The new package will also get a brand new docs site, powered by [VitePress](https://vitepress.dev/).

<!-- exclude-from-website: -->
---

## Readme

<img src="https://rockett.pw/git-assets/vue-routisan/logo.svg" alt="Vue Routisan" width="250">

Elegant, fluent route definitions for [Vue Router](https://router.vuejs.org/), inspired by [Laravel](https://laravel.com).</p>

![Release 3.x](https://rockett.pw/git-assets/vue-routisan/release-3x.badge.svg)
![Made with JavaScript](https://rockett.pw/git-assets/badges/javascript.badge.svg)
![Gluten Free](https://rockett.pw/git-assets/badges/gluten-free.badge.svg)
![Built with ♥](https://rockett.pw/git-assets/badges/with-love.badge.svg)

**Routisan 3 is currently in beta. Stable release around the corner!**

<!-- /exclude-from-website -->

```sh
npm i vue-routisan@next # or yarn add vue-routisan@next
```

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

## Documentation

You can read the docs on the [Vue Routisan 3 site](https://vue-routisan.rockett.pw/).

## Upgrading from v2.x

If you are upgrading a project to Routisan 3, please consult the [upgrade guide](upgrading.md).

Keep in mind that Routisan 3 is currently in beta. It is suitable for production use, but it would be wise to wait for the stable release before using it in large projects where potential breaking changes might make the upgrade path unnecessarily complex.

## Changelog

Routisan’s changelog is maintained [here](changelog.md).

## License

Vue Routisan is licensed under the ISC license, which is more permissive variant of the MIT license. You can read the license [here](license.md).

## Contributing

If you would like to contribute code to Vue Routisan, simply open a Pull Request containing the changes you would like to see. Please provide a proper description of the changes, whether they fix a bug, enhance an existing feature, or add a new feature.

If you spot a bug and don’t know how to fix it (or just don’t have the time), simply [open an issue](https://github.com/mikerockett/vue-routisan/issues/new). Please ensure the issue is descriptive, and contains a link to a reproduction of the issue. Additionally, please prefix the title with the applicable version of Routisan, such as `[3.0]`.

Feature requests may also be submitted by opening an issue – please prefix the title with "Feature Request"
