'use strict'

const { Observable } = require('rxjs/Observable')


module.exports = genFn => (...args) => new Observable(observer$ => {
  if ( typeof genFn !== 'function' || !isGenerator(genFn()) ) {
    return observer$.error(
      new Error(`Expecting generator function, but instead got "${JSON.stringify(genFn) || String(genFn)}"`)
    )
  }
  next( genFn(...args), observer$ )
})


const next = (gen, observer$, data = undefined) => {
  try {
    const { done, value } = gen.next(data)
    if (done) {
      observer$.complete()
      observer$.dispose()
    }

    if ( isPromise(value) ) {
      value
        .then(v => {
          observer$.next(v)
          setImmediate(() => next(gen, observer$, v))
        })
        .catch(e => observer$.error(e))
    } else {
      observer$.next(value)
      setImmediate(() => next(gen, observer$, value))
    }
  } catch (e) {
    observer$.error(e)
  }
}


const isGenerator = obj =>
  Boolean(obj) &&
  typeof obj.next === 'function' &&
  typeof obj.return === 'function' &&
  typeof obj.throw === 'function'


const isPromise = obj =>
  Boolean(obj) &&
  typeof obj.then === 'function' &&
  typeof obj.catch === 'function'
