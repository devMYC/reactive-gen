'use strict'

import rxgen from '../'
import test from 'ava'


test('should give error when passing invalid param to rxgen', t => {
  const params = [ undefined, null, 1, '1', [], {}, () => {}, Promise.resolve(1) ]
  t.plan(params.length)
  params.forEach(param =>
    rxgen(param)()
      .subscribe(null, e => t.true(e instanceof Error))
  )
})


test('should give error when generator function yield error', t => {
  t.plan(1)
  const fn = rxgen(function* (n) {
    while (n > 0) {
      yield new Promise((resolve, reject) =>
        n % 6 ? resolve(n) : reject(n)
      )
      n--
    }
  })

  return new Promise((_, reject) =>
    fn(10).subscribe(null, e => reject(e))
  )
  .catch(e => t.true(e === 6))
})


test('shoud finish executing generator function successfully', t => {
  t.plan(1)
  const fn = rxgen(function* (n) {
    while (n > 0) {
      yield new Promise(resolve => resolve(n))
      n--
    }
  })

  return new Promise(resolve =>
    fn(3).subscribe(null, null, () => resolve())
  )
  .then(_ => t.pass())
})


test('should also finish executing generator function successfully', t => {
  t.plan(1)
  const fn = rxgen(function* (n) {
    while (n > 0) {
      yield n
      n--
    }
  })

  return new Promise(resolve =>
    fn(3).subscribe(null, null, () => resolve())
  )
  .then(_ => t.pass())
})

