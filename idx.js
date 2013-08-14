var levelup = require('levelup'),
  indexers = require('require-all')({
    dirname: __dirname + '/indexers',
    filter: /(.+)\.js$/
  }),
  all_indexers = Object.keys(indexers),
  bytewise = require('bytewise');

function Idx(path, options) {
  options = options || {};
  this.path = path;
  this.options = options;
  this.db = levelup(path, {
    keyEncoding: 'binary',
    valueEncoding: 'json'
  });
}

Idx.prototype.calculate = function (documents) {
  var self = this;

  return documents.map(function (doc) {
    return {
      doc: doc,
      _id: doc._id,
      idxspecs: all_indexers.reduce(function (memo, mdl) {
        var f = indexers[mdl];
        var idxs = f(self.options.active, doc);
        idxs.forEach(function (i) {
          memo.push(i);
        })
        return memo;
      }, [])
    };
  });
}

Idx.prototype.update = function (documents, cb) {
  //
  // always update a set of documents
  //
  if (!Array.isArray(documents)) {
    documents = [documents];
  }

};

Idx.prototype.destroy = function (documents, cb) {
  //
  // always destroy a set of documents
  //
  if (!Array.isArray(documents)) {
    documents = [documents];
  }
};

Idx.prototype.query = function (start, end, cb) {
  var results = [],
    reader = this.db.createReadStream({
      start: bytewise.encode([start]),
      end: bytewise.encode([end])
    }),
    self = this;
  reader.on('data', function (data) {
    data.key = bytewise.decode(data.key)[0];
    results.push(data);
  });
  reader.on('end', function () {
    cb(null, results);
  });
  reader.on('error', cb);
};

module.exports = function (path, options) {
  return new Idx(path, options);
};

module.exports._indexers = indexers;
module.exports._all_indexers = all_indexers;
module.exports._version = require('./package').version;
// lint: 2 errors
