# dotjson
get/set api for .json files, like config files

## usage example

    var dotjson = require('dotjson')

    // get the version from package.json
    var version = dotjson.get('./node_modules/package.json', 'version')

    // set some configuration options, creating the file if it doesn't exist
    dotjson.set('.conf',
    {
      powerLevel: 9001
    , robotMorale: 'high and steady'
    , isRaining: false
    },
    {createFile: true})


## api

### `dotjson.get(filename, path)`

Reads the contents of `filename` and returns the value of `path`. `path` can be a single path or an array of paths. if it's a single path, `get` returns it. if it's an array of paths, `get` returns an array of values in the same order, like `Array.prototype.map`. If the path is not found, the value will be undefined.

Throws an error if there is a problem reading from the file.


### `dotjson.set(filename, setter, opts)`

Opens `filename` and upserts it according to `setter`, an object map of paths and values. For example, if the config file currently contains `{name: {first: 'alice', last: 'cooper'}}`, then the following setter would update the config to refer to a certain reporter:

    {
      'name.first': 'anderson'
    }

Since `setter` is an object, you can specify multiple path/value pairs to set in one operation.

`opts` is an (optional) options object.

Options:
* `createFile` (boolean, default false) - attempt to create the file if it does not already exist

Throws an error if there is a problem writing to the file.

Returns void.


## path notation
This module uses [mongodb dot notation](http://docs.mongodb.org/manual/reference/glossary/#term-dot-notation
) for paths. It's simple, really - imagine you're writing javascript using only [] bracket accessor notation. Now do that, but with dots instead, including for array indices. See also [@rauchg](https://npmjs.org/~rauchg)'s module, [dot-component](https://npmjs.org/package/dot-component).


## tests
run `npm test` from the root module directory


## zomg, BLOCKING, wtf? o_O
Yes, it's meant for working with tiny json config files in cli scripts. If things like performance, memory usage, or concurrency are important, this might not be your module. If you just want to work with json config files with ease, read on.


## license
MIT
(c) 2012 jden - Jason Denizac <jason@denizac.org>
http://jden.mit-license.org/2012