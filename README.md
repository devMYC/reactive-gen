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
```
