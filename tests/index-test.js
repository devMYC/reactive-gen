'use strict'

import rxgen from '../'
import test from 'ava'
import 'rxjs/add/operator/map'


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


test('should get desired value from generator', t => {
  t.plan(1)
  const got = []
  const expected = 18
  const fn = rxgen(function* (n) {
    const squared = yield n * n
    yield squared * 2
  })

  return new Promise(resolve =>
    fn(3).subscribe(
      v => got.push(v),
      null,
      () => resolve(got[got.length - 1])
    )
  )
  .then(v => t.true(v === expected))
})


test('chaining rxjs operators with rxgen', t => {
  t.plan(1)
  const got = []
  const expected = [ 4, 16 ]
  const fn = rxgen(function* (n) {
    const plusOne = yield Promise.resolve(n + 1)
    yield plusOne * 2
  })

  return new Promise(resolve =>
    fn(1)
      .map(x => x * x)
      .subscribe(
        v => got.push(v),
        null,
        () => resolve(got)
      )
  )
  .then(v => t.deepEqual(v, expected))
})

