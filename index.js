var dot = require('dot-component')
var fs = require('fs')

module.exports.get = function (filename, path) {
  var file = fs.readFileSync(filename, 'utf-8')
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

  if (!createFile && !fs.existsSync(filename)) {
    throw new Error('ENOENT')
  }

  var fd;
  try {
    fd = fs.openSync(filename, 'wx+')
    readAndUpdate(fd, setter)
  } catch (e) {
    throw e;
  } finally {
    if (fd) {
      fs.closeSync(fd)
    }
  }

}

function readAndUpdate(fd, setter) {
  var file = readStringSync(fd)
  var data = file ? JSON.parse(file) : {}

  for (var path in setter) {
    var val = setter[path]
    dot.set(data, path, val)
  }

  // pretty print it... for the humans
  file = JSON.stringify(data, null, 2)

  writeStringSync(fd, file)
}

function readStringSync(fd, encoding) {
  // taken from node's fs#readFileSync... but this takes an already open fd
  encoding || (encoding = 'utf8')

  var size = fs.fstatSync(fd).size;

  var pos = 0;
  var buffer; // single buffer with file data
  var buffers; // list for when size is unknown

  if (size === 0) {
    buffers = [];
  } else {
    buffer = new Buffer(size);
  }

  var done = false;
  while (!done) {
    if (size !== 0) {
      var bytesRead = fs.readSync(fd, buffer, pos, size - pos);
    } else {
      // the kernel lies about many files.
      // Go ahead and try to read some bytes.
      buffer = new Buffer(8192);
      var bytesRead = fs.readSync(fd, buffer, 0, 8192);
      if (bytesRead) {
        buffers.push(buffer.slice(0, bytesRead));
      }
    }

    pos += bytesRead;
    done = (bytesRead === 0) || (size !== 0 && pos >= size);
  }

  if (size === 0) {
    // data was collected into the buffers list.
    buffer = Buffer.concat(buffers, pos);
  } else if (pos < size) {
    buffer = buffer.slice(0, pos);
  }

  return buffer.toString(encoding)
}

function writeStringSync(fd, str, encoding) {
  // taken from node's fs#writeFileSync... but this takes an already open fd
  encoding || (encoding = 'utf8')

  if (!Buffer.isBuffer(str)) {
    str = new Buffer('' + str, encoding);
  }
  var written = 0;
  var length = str.length;
  while (written < length) {
    written += fs.writeSync(fd, str, written, length - written, written);
  }
}