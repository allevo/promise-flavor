# Promise Flavor [![Build Status](https://travis-ci.org/allevo/promise-flavor.svg)](https://travis-ci.org/allevo/promise-flavor) [![Coverage Status](https://coveralls.io/repos/github/allevo/promise-flavor/badge.svg)](https://coveralls.io/github/allevo/promise-flavor)

## Synopsis

This library is thougth to be simple, fast and easy to use.
It implements the classic function needed to develop easier

## Motivation

The Promise specs make the life easier but not at all. This library is thougth for you. See `API Reference` section to see all features

## Installation

```
npm install promise-flavor
```

## API Reference
**NB:** All function used for the examples return an instance of Promise

### parallel
```
parallel([func1, func2, func3])
    .then(r => console.log(r[0], r[1], r[2]))
    
parallel({user: getUser, options: getOptions, credential: getCredential})
    .then(r => console.log(r.user, r.options, r.credential))
```
The returned promise is resolved with an array or an object filled with the all values.
This function works in parallel.

### serie
```
serie([func1, func2, func3])
    .then(r => console.log(r[0], r[1], r[2]))
    
serie({user: getUser, options: getOptions, credential: getCredential})
    .then(r => console.log(r.user, r.options, r.credential))
```
The returned promise is resolved with an array or an object filled with the all values.
This function works in serie.

### map
```
function fsReadFileAndReturnAPromise(filePath) { ... }

map(['path1', 'path2', 'path3'], fsReadFileAndReturnAPromise)
    .then(r => console.log(r[0], r[1], r[2]))
    
map({
        preferences: 'path1',
        credentials: 'path2',
        options: 'path3'
    }, fsReadFileAndReturnAPromise)
    .then(r => console.log(r.preferences, r.credentials, r.options))
```
Call `fsReadFileAndReturnAPromise` for each element of the array or values of the object.

### filter
```
function fsIsPathExistsAndReturnAPromise(filePath) { ... }

filter(['path1', 'path2', 'path3'], fsIsPathExistsAndReturnAPromise)
    .then(r => console.log(r)) // array that contains only the available paths
    
filter({
        preferences: 'path1',
        credentials: 'path2',
        options: 'path3'
    }, fsIsPathExistsAndReturnAPromise)
    .then(r => console.log(r)) // object only with values contain only the available paths
```
Call `fsIsPathExistsAndReturnAPromise` for each element of the array or values of the object. The resolved promise contains the elements that the promise is resolved with `true` value.

### waterfall
```
const func1 = (p) => Promise.resolve(1) // p === undefined
const func2 = (p) => Promise.resolve(p + 2) // p === 1
const func3 = (p) => Promise.resolve(p * 3) // p === 2 + 1
waterfall([func1, func2, func3])
    .then(r => console.log(r === 9)) // true
```
Call the next function using the previous value as argument. This function returns an instance of Promise resolved with the last resolved values.

### waterfall
```
const func1 = (p) => Promise.resolve(1) // p === undefined
const func2 = (p) => Promise.resolve(p + 2) // p === 1
const func3 = (p) => Promise.resolve(p * 3) // p === 2 + 1
waterfall([func1, func2, func3])
    .then(r => console.log(r === 9)) // true
```
Call the next function using the previous value as argument. This function returns an instance of Promise resolved with the last resolved value.

### retry
```
const options = { times: 5, delay: 100, delayType: retry.DELAY_TYPES.LINEAR}
retry(func, options)
    .then(r => console.log(r))
```
Try to run `func` `options.times` times with some delay if specified.
The options argument is optional. The default values are:
 * times 3
 * delay 0 // ms
 * delayType retry.DELAY_TYPES.CONSTANT

The `delayType` value is a function, so some custom implementations are admitted.

### auto
```
auto({
        me: getMe,
        options: getOptions,
        user: ['me', 'options', r => User.loadUserWithOptions(r.me, r.options)]
    })
    .then(r => console.log(r.me, r.options, r.user))
```
Resolve a dependecy tree. Return a Promise with the resolved tree


### parallelAnyway
```
parallelAnyway([
        func1,
        func2,
        () => Promise.reject(new Error('DOOM')),
        func3
    ])
    .then(r => {
        console.log(r.results[0], results.r[1], results.r[3])
        console.log(r.errors[2])
    })

parallelAnyway({
        user: getUser,
        options: getOptions,
        ouch: () => Promise.reject(new Error('DOOM')),
        credential: getCredential
    })
    .then(r => {
        console.log(r.results.user, r.results.options, r.results.credential)
        console.log(r.errors.ouch)
    })
```
This function is like `parallel` but tries to never fail either some promises do.


### serieAnyway
```
serieAnyway([
        func1,
        func2,
        () => Promise.reject(new Error('DOOM')),
        func3
    ])
    .then(r => {
        console.log(r.results[0], results.r[1], results.r[3])
        console.log(r.errors[2])
    })

serieAnyway({
        user: getUser,
        options: getOptions,
        ouch: () => Promise.reject(new Error('DOOM')),
        credential: getCredential
    })
    .then(r => {
        console.log(r.results.user, r.results.options, r.results.credential)
        console.log(r.errors.ouch)
    })
```
This function is like `serie` but tries to never fail either some promises do.

### mapAnyway
```
map(['path1', 'path2', 'path3', 'Inexistent File Path'], fsReadFileAndReturnAPromise)
    .then(r => {
        console.log(r.results[0], r.results[1], r.restuls[2])
        console.log(r.errors[3])
    })
    
map({
        preferences: 'path1',
        credentials: 'path2',
        options: 'path3',
        ouch: 'Inexistent File Path',
    }, fsReadFileAndReturnAPromise)
    .then(r => {
        console.log(r.results.preferences, r.results.credentials, r.results.options)
        cosnole.log(r.errors.ouch)
    })
```
This function is like `map` but tries to never fail either some promises do.

### filterAnyway
```
function fsIsPathExistsAndReturnAPromise(filePath) { ... }

filterAnyway(['path1', 'path2', 'path3'], fsIsPathExistsAndReturnAPromise)
    .then(r => console.log(r.results, r.errors))
    
filterAnyway({
        preferences: 'path1',
        credentials: 'path2',
        options: 'path3'
    }, fsIsPathExistsAndReturnAPromise)
    .then(r => console.log(r.results, r.errors))
```
This function is like `filter` but tries to never fail either some promises do.

## Tests
```
npm test
```

## Contributors

All contribution are welcomed. Open a PR to start a discussion or to contribute!
