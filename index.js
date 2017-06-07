'use strict'

const { Subject } = require('rxjs/Subject')


module.exports = genFn => (...args) => ({
  subscribe: (onNext, onError, onComplete) => {
    const subject$ = new Subject()
    subject$.subscribe(onNext, onError, onComplete)
    if ( typeof genFn !== 'function' || !isGenerator(genFn()) ) {
      return subject$.error(
        new Error(`Expecting generator function, but instead got "${JSON.stringify(genFn) || String(genFn)}"`)
      )
    }
    next( genFn(...args), subject$ )
  }
})


const next = (gen, subject$, data = undefined) => {
  try {
    const { done, value } = gen.next(data)
    if (done) {
      subject$.complete()
      subject$.dispose()
    }

    if ( isPromise(value) ) {
      value
        .then(v => {
          subject$.next(v)
          setImmediate(() => next(gen, subject$, v))
        })
        .catch(e => subject$.error(e))
    } else {
      subject$.next(value)
      setImmediate(() => next(gen, subject$, value))
    }
  } catch (e) {
    subject$.error(e)
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
