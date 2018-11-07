# Development

IMPORTANT: While the library is supposed to work with Node 6 you will need to Node 8 or higher to run the tests.

## Setup

```
npm install
```

## Running the tests

```js
npm run test
```

Running them in watch mode

```js
npm run test -- --watch
```

## Running the browser tests

```js
npm run test:browser
```

# Design Decision

The purpose of this section is to introduce contributors to the philosophy and thinking behind the architecture and API design of this library.

### Isomorphic Use of the SDK

In order to allow various use-cases we want to make sure the SDK works not only in Node, but also in environments like a browser.
