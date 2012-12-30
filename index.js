var dot = require('dot-component')
var fs = require('fs')

module.exports.get = function (filename, path) {
  var file = fs.readFileSync(filename, 'utf8')
  var data = JSON.parse(file)

  if (typeof path === 'string') {
    return dot.get(data, path)
  }

  if (Array.isArray(path)) {
    return path.map(function (p) {
      return dot.get(data, p)
    })
  }
}

module.exports.set = function (filename, setter, opts) {
  var createFile = opts && opts.createFile;

  var data = {}

  if (!fs.existsSync(filename)) {
    if (!createFile)
      throw new Error('ENOENT')
  } else {
    var file = fs.readFileSync(filename, 'utf8')
    data = JSON.parse(file)
  }

  for (var path in setter) {
    var val = setter[path]
    dot.set(data, path, val)
  }

  // pretty print it... for the humans
  file = JSON.stringify(data, null, 2)

  fs.writeFileSync(filename, file, 'utf8')

}