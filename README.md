# babylon.js + vite + ts + recast-navigation-js

## Description

babylon.js plugin for https://github.com/isaac-mason/recast-navigation-js

Supports single thread, worker and wasm.

This is a drop in replacement for the existing plugin. You don't need to change anything in your code just one line where you import the plugin.

## Instructions

- clone or download the repo
- npm install
- For development: `npm run dev`
- For production: `npm run build` then to preview what was built `npm run preview`

### How to use the plugin in your project
- copy the `src/navigation` folder to your `src` directory.
- you need to import the plugin included in this repo instead the one provided in the babylon.js libs.

### How to change the running mode of recast-navigation-js

Look at these file how to use and init recast-navigation-js in different modes.

- Single thread mode `src/navigation/navigation.single-thread.ts`
- Worker mode `src/navigation/navigation.single-thread.ts`
- WASM mode `src/naviagtion/navigation.wasm.ts`

## Examples

There are currently only two examples. The default one is the implementation of the playground code https://playground.babylonjs.com/#KVQP83#0 from the babylon.js docs.

You can swich to run the other example(s) by chaging the imported class in `src/RecastNavigationJSApp.ts`:

```javascript
// examples
// import { NavigationSingleThread as NavigationExample } from "./examples/index.single-thread";
import { NavigationCrowd as NavigationExample } from "./examples/index.navmesh-crowd";
```

## Development mode and debugging
First `npm run dev`
Then in vscode press F5, otherwise just open a browser at http://localhost:3000/

## Production build
First `npm run build`
A `dist` folder is created and contains the distribution. 
You can `npm run preview` it on your development machine.
Production preview runs at http://localhost:5000/ . The terminal will display external URLs if you want to test from a phone or tablet.


