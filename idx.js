var levelup = require('levelup'),
  indexers = require('require-all')({
    dirname: __dirname + '/indexers',
    filter: /(.+)\.js$/,
  }),
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

module.exports._all_indexers = indexers;
module.exports._version = require('./package').version;
