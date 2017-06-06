# Usage

```javascript
const fn = rxgen(function* (n) {
  while (n > 0) {
    yield n
    n--
  }
})

fn(10)
  .subscribe(
    v => console.log(v),
    e => console.error(e),
    _ => console.log('Completed')
  )
```
