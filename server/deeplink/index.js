const fs = require('fs');
const inliner = require('html-inline');
const stream = require('stream');
const path = require('path');

module.exports = (options) => {
  options = options || {};
  if (!options.fallback) {
    throw new Error('Error (deeplink): options.fallback cannot be null');
  }
  options.android_package_name = options.android_package_name || '';
  options.ios_store_link = options.ios_store_link || '';
  options.title = options.title || '';

  const deepLink = (req, res, next) => {
    const opts = {};
    console.log('params', JSON.stringify(req.params));
    console.log('body', JSON.stringify(req.body));
    console.log('query', JSON.stringify(req.query));
    console.log('originalUrl', JSON.stringify(req.originalUrl));

    Object.keys(options).forEach((k) => {
      opts[k] = options[k];
    });

    // bail out if we didn't get url
    if (!req.query.url) {
      return next();
    }
    opts.url = req.query.url;

    if (req.query.fallback) {
      opts.fallback = req.query.fallback;
    }
    console.log('URL', opts.url);
    // read template file
    const file = fs.createReadStream(path.join(__dirname, '/template/index.html'));

    // replace all template tokens with values from options
    const detoken = new stream.Transform({ objectMode: true });
    detoken._transform = (chunk, encoding, done) => {
      let data = chunk.toString();
      Object.keys(opts).forEach((key) => {
        data = data.replace(`{{${key}}}`, opts[key]);
      });

      this.push(data);
      done();
    };

    // inline template js with html
    const inline = inliner({ basedir: path.join(__dirname, '/template') });

    // make sure the page is being sent as html
    res.set('Content-Type', 'text/html;charset=utf-8');

    // read file --> detokenize --> inline js --> send out
    file
      .pipe(detoken)
      .pipe(inline)
      .pipe(res);
  };

  return deepLink;
};
