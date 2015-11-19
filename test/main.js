"use strict"
const request = require("supertest")
const Koa = require("koa")
const adapt = require("../")
const Adapter = adapt.Adapter


describe('wrap w/ adapter', () => {
  it('should compose middleware w/ async functions', done => {
    const app = new Koa()
    const calls = []

    function* fn(tick) {
      yield Promise.resolve(1)
      calls.push(1)
      yield tick
      calls.push(6)
    }
    
    app.use(adapt(fn))

    app.use(async function(ctx, next) {
      calls.push(2)
      await next()
      calls.push(5)
    })

    app.use(async (ctx, next) => {
      calls.push(3)
      await next()
      calls.push(4)
    })

    const server = app.listen()

    request(server)
      .get('/')
      .expect(404)
      .end(err => {
        if (err) return done(err)
        calls.should.eql([1, 2, 3, 4, 5, 6])
        done()
      })
  })
})


describe('modify Koa::use', () => {
  it('should compose middleware w/ async functions', done => {
    const app = new (Adapter(Koa))()
    const calls = []

    function* fn(tick) {
      yield Promise.resolve(1)
      calls.push(1)
      yield tick
      calls.push(6)
    }
    
    app.use(fn)

    app.use(async function(ctx, next) {
      calls.push(2)
      await next()
      calls.push(5)
    })

    app.use(async (ctx, next) => {
      calls.push(3)
      await next()
      calls.push(4)
    })

    const server = app.listen()

    request(server)
      .get('/')
      .expect(404)
      .end(err => {
        if (err) return done(err)
        calls.should.eql([1, 2, 3, 4, 5, 6])
        done()
      })
  })
})
