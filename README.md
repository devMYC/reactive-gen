# Usage

```javascript
const RG = require('reactive-gen')

const rg = RG(function* (n) {
  const value = yield Promise.resolve(n * n)
  yield value * 2
})

rg(10)
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
import RG from 'reactive-gen'
import 'rxjs/add/operator/map'

const rg = RG(function* (greetings) {
  for (const greet of greetings) {
    yield greet
  }
})

rg([ 'Hello', '你好', 'Bonjour' ])
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
