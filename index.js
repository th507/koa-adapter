"use strict"

const isgen = require("is-generator-function")
const wrap = require("co").wrap
const curry = Function.bind.bind(Function.call)

module.exports = adapt
module.exports.Adapter = Adapter

function* tick(next) { yield next() }

function adapt(middleware) {
  // skip for non-function
  if (typeof middleware !== 'function') return middleware

  // skip for modern middleware
  if (!isgen(middleware)) return middleware

  // avoid wrapping middleware for every request
  let fn = wrap(curry(middleware))

  return function(ctx, next) {
    return fn(ctx, tick(next))
  }
}

  
function Adapter(Koa) {
  var use = Koa && Koa.prototype && Koa.prototype.use

  if (!use || typeof use !== "function") return Koa

  Koa.prototype.use = function(fn) {
    return use.call(this, adapt(fn))
  }

  return Koa
}
