var parentchild = require('parentchild');

module.exports = function base_idx(cfg, doc) {
  var idxs = [];
  parentchild(doc).forEach(function (idxspec) {
    if (cfg.indexOf(idxspec[0]) !== -1) {
      idxs.push(idxspec);
    }
  });
  return idxs;
};
