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
  const SET_FILE = __dirname + '/set.json'
  t.plan(1)
  try {
    var expected = heredoc(function(){/*
{
  "powerLevel": 9001,
  "robotMorale": "high and steady",
  "isRaining": false
}
  */})

    dotjson.set(SET_FILE, require(GET_FILE), {createFile: true})

    var out = fs.readFileSync(SET_FILE, 'utf8')

    t.equal(out, expected)

  } finally {
    if (fs.existsSync(SET_FILE)) {
      fs.unlinkSync(SET_FILE)
    }
    t.end();
  }

})

test('set with existing file', function (t) {
  const EXISTING_FILE = __dirname + '/exists.json'
  t.plan(2)
  var threw = true
  try {
  var before = heredoc(function(){/*
{
  "thisFile": "already exists",
  "another": "value"
}
  */})
  var after = heredoc(function(){/*
{
  "thisFile": "works just fine",
  "another": "value"
}
  */})

    fs.writeFileSync(EXISTING_FILE, before, 'utf-8')

    dotjson.set(EXISTING_FILE, {thisFile: "works just fine"}, {createFile: true})

    var out = fs.readFileSync(EXISTING_FILE, 'utf8')

   t.equal(out, after)
   threw = false

  } finally {
    if (fs.existsSync(EXISTING_FILE)) {
      fs.unlinkSync(EXISTING_FILE)
    }
    t.ok(!threw)
    t.end();
  }

})