# Koa Adapter

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]

Never have to worry about Koa's middleware compatibility.

# Installation

```
$ npm install koa-adapter
```

# Example
You could choose one of the two method.

#### Adapt individual middleware
```js
const adapt = require("koa-adapter")

// koa-logger@1 only support koa@1
const logger = require("koa-logger")
const koa = require("koa")

const app = new Koa()
app.use(adapt(logger))

```

#### Modify `Koa::use`
Support old (generator) middleware and the new middleware syntax

```js
const Adapter = require("koa-adapter").Adapter

const _Koa = require("koa")
const Koa = Adapter(_Koa)

const app = new Koa()

// use Koa 1.0 middleware
app.use(function*(next) {
  const start = Date.now()

  yield next

  const ms = Date.now() - start
  console.log(`${this.method} ${this.url} - ${ms}ms`)
})

// or use new syntax
app.use(ctx => {
  ctx.body = "Hello World"
})

// or use `async` function (Babel required)
app.use((ctx, next) => {
  const start = new Date
  await next()
  const ms = new Date - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

```


# License

Copyright (c) 2015 Jingwei "John" Liu

Licensed under the MIT license.
  
[npm-image]: https://img.shields.io/npm/v/koa-adapter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-adapter
[travis-image]: https://img.shields.io/th507/koa-adapter/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/th507/koa-adapter
