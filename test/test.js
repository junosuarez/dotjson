var test = require('tape')
var heredoc = require('heredoc')
var fs = require('fs')
var dotjson = require('../index')

const GET_FILE = __dirname + '/get.json'

test('get', function (t) {
  t.plan(2)

  var threw = true

  try {
    var powerLevel = dotjson.get(GET_FILE, 'powerLevel')
    t.equal(powerLevel, 9001)
    threw = false;
  } finally {
    t.ok(!threw)
    t.end()
  }

})

test('get multiple', function (t) {
  t.plan(4)

  var threw = true

  try {
    var results = dotjson.get(GET_FILE, ['powerLevel', 'robotMorale'])
    t.equal(results[0], 9001)
    t.equal(results[1], 'high and steady')
    t.equal(results.length, 2)
    threw = false;
  } finally {
    t.ok(!threw)
    t.end()
  }

})

test('set', function (t) {
  t.plan(1)
  try {
  var expected = heredoc(function(){/*
{
  "powerLevel": 9001,
  "robotMorale": "high and steady",
  "isRaining": false
}
  */})

   dotjson.set('./set.json', require(GET_FILE), {createFile: true})

   var out = fs.readFileSync('./set.json', 'utf8')

   t.equal(out, expected)

  } finally {
    if (fs.existsSync('./set.json')) {
      fs.unlinkSync('./set.json')
    }
    t.end();
  }

})