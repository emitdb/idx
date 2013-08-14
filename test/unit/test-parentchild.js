var assert = require('assert'),
  idx = require('../../idx'),
  powerset = require('powerset'),
  parentchild = idx._indexers.parentchild;

var sampledoc = {
  a: {
    b: 'foo'
  },
  c: ['a', 'b']
};

var allIndexes = [
  ['child', undefined, 'a'],
  ['child', 'a', 'b'],
  ['value', 'b', 'foo'],
  ['child', undefined, 'c'],
  ['inarray', 'c', 'a'],
  ['inarray', 'c', 'b']];

function indexesFor(keys) {
  var res = [];
  allIndexes.forEach(function (idxspec) {
    keys.forEach(function (key) {
      if (idxspec[0] === key) {
        res.push(idxspec);
      }
    });
  });
  return res;
}

var pset = powerset(['child', 'value', 'inarray']);

pset.forEach(function (item) {
  var expect = indexesFor(item),
    real = parentchild(item, sampledoc);
  assert.deepEqual(expect, real);
});

assert.ok(true);
