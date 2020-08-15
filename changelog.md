<img src="https://rockett.pw/git-assets/vue-routisan/logo.svg" alt="Vue Routisan" width="250">

# Changelog

## `v3.0.0-alpha.1`

This is a complete rewrite of Routisan, from the ground up. The aim was to provide a more context-aware and efficient way of building up a route-tree without changing the vast majority of the API, which makes the upgrade process relatively straight-forward. Note, however, that this re-build brings Vue routing a little close to Laravel routing and, as such, has a few breaking changes.

Your setup will determine upgrade-complexity, however the [upgrade guide](upgrading.md) will help you out.

**So, what's new under the hood?**

In v2, Routes were built up using a `Route` instance-helper and a shared container through an iterative, recursive merging process, building route config on the fly. The v3 approach is quite different, where a `Factory` delegate is used to build up a tree of routes, which is then recursively compiled to a Vue Router-compatible config and flushed from memory.

Apart from this, here's a list that details everything that's been added, changed, and fixed. Again, there are breaking changes here, so please review the below and the upgrade guide.

### Added

- **Routing:**
  - Name-cascading, which allows names to cascade or funnel down from route to route.
  - Names are joined together using the separator specified in `Factory.withNameSeparator(string)`, which defaults to a period (`.`).

- **Semantics and Utilities:**
  - Helper functions for `view`, `redirect`, `group` were added, in the case you don't want to use `Route` everywhere.
  - A `fallback` option was added to `Route`, along with the corresponding helper function.
  - Route parameters may now be declared using `{curly braces}` in addition to `:colons`.
  - Additionally, if two parameters are `{joined}{together}`, they will be separated by a slash (`/`).
  - The `{all}` paramater, which translates to `(.*)`, was added.
  - The `(number)` and `(string)` constraint-aliases, which translate to `(\\d+)` and `(\\w+)` respectively, were added.
  - For debugging, you can call `Route.dump()` to see all compiled routes in the console. `Factory.dump()` is also available and shows what the routes look like before compilation. Note, though, that internal variable names are mangled by Terser, so you'll need to figure out your way around the tree structure.

### Changed

- **Views and Resolvers:**
  - View resolvers are now set on the `Factory` with the `usingResolver` method.
  - Named views are now passed in as additional views, the third argument to `view`.
  - Likewise, the second argument to `view` no longer compiles down to `component`, but rather `components.default`, which is what [Vue Router does](https://github.com/vuejs/vue-router/blob/7d7e048490e46f4d433ec6cf897468409d158c9b/src/create-route-map.js#L86) with `RouteRecord.component`.

- **Guards:**
  - The v2 `vue-router-multiguard` setup has been replaced with a Promise-based class system. Amoung other benefits, this change affords guards the ability to run an optional callback on navigation-rejection, the return value of which will be passed to `next`. All guards must extend the `Guard` class and implement the `handle(resolve, reject, [context])` method.
  - Guards must registered through the `Factory`, using the `withGuards` method. They are then used in route definitions by name, which may or may not be aliased when registered.
  - When rejecting navigation, Routisan will detect rejection loops and warn you when it finds them.
  - When applying multiple guards to a route, an array is no longer required – simply add each guard as an argument to the `guard` method.
  - Useful for debugging, guards may log the outcome of their inner promises by declaring a method that returns a boolean, called `logPromiseOutcomes`.

- **Internal:**
  - Builds are now performed by [microbundle](https://github.com/developit/microbundle) using the <abbr title="CommonJS">CJS</abbr>, <abbr title="Universal Module Definition">UMD</abbr>, <abbr title="ECMAScript Module">ESM</abbr> and modern output formats, compressed with Terser.

### Fixed

These are not fixes, technically. Rather, they are existing issues that the rewrite solves.

- Any issues pertaining to route concatenation are gone.
- Groups and children now play nicely together.

### Removed

- To reduce duplication issues, the `Route.options` method is no longer required and has been removed. You should use the corresponding route-builder methods instead.
