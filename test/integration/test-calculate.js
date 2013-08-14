var assert = require('assert'),
  rimraf = require('rimraf'),
  idx = require('../../idx');

var sample = {
  "_id": "2",
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossList": {
        "GlossEntry": {
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": ["GML", "XML"]
          },
          "GlossSee": "markup"
        }
      }
    }
  }
};

var sampleidxs = [
  ['child', undefined, '_id'],
  ['value', '_id', '2'],
  ['child', undefined, 'glossary'],
  ['child', 'glossary', 'title'],
  ['value', 'title', 'example glossary'],
  ['child', 'glossary', 'GlossDiv'],
  ['child', 'GlossDiv', 'title'],
  ['value', 'title', 'S'],
  ['child', 'GlossDiv', 'GlossList'],
  ['child', 'GlossList', 'GlossEntry'],
  ['child', 'GlossEntry', 'ID'],
  ['value', 'ID', 'SGML'],
  ['child', 'GlossEntry', 'SortAs'],
  ['value', 'SortAs', 'SGML'],
  ['child', 'GlossEntry', 'GlossTerm'],
  ['value', 'GlossTerm', 'Standard Generalized Markup Language'],
  ['child', 'GlossEntry', 'Acronym'],
  ['value', 'Acronym', 'SGML'],
  ['child', 'GlossEntry', 'Abbrev'],
  ['value', 'Abbrev', 'ISO 8879:1986'],
  ['child', 'GlossEntry', 'GlossDef'],
  ['child', 'GlossDef', 'para'],
  ['value', 'para', 'A meta-markup language, used to create markup languages such as DocBook.'],
  ['child', 'GlossDef', 'GlossSeeAlso'],
  ['inarray', 'GlossSeeAlso', 'GML'],
  ['inarray', 'GlossSeeAlso', 'XML'],
  ['child', 'GlossEntry', 'GlossSee'],
  ['value', 'GlossSee', 'markup']];

var index = idx(__dirname + '_calculate_test', {
  active: ['child', 'value', 'inarray']
});

var resultForSample = index.calculate([sample])[0];

assert.equal(resultForSample._id, 2);
assert.deepEqual(resultForSample.idxspecs, sampleidxs);

//
// cleanup
//
rimraf(index.db.location, function (err) {
  assert.equal(err, null);
});
