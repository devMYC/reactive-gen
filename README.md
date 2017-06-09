# Usage

```javascript
const fn = rxgen(function* (n) {
  const value = yield Promise.resolve(n * n)
  yield value * 2
})

fn(10)
  .subscribe(
    v => console.log(v),
    e => console.error(e),
    _ => console.log('Completed')
  )

/* Output
> 100
> 200
> Completed
*/
```

you can also chain rxjs operators

```javascript
const fn = rxgen(function* (greetings) {
  for (const greet of greetings) {
    yield greet
  }
})

fn([ 'Hello', '你好', 'Bonjour' ])
  .map(s => s + '!')
  .subscribe(
    s => console.log(s),
    e => console.error(e),
    _ => console.log('Completed')
  )

/* Output
> Hello!
> 你好!
> Bonjour!
> Completed
*/
```
