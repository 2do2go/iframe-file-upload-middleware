# Iframe file upload helper for expressjs

express framework already provides convenient way for uploading files using
bodyParser. Ajax file uploading works great at modern browsers but we
need a fallback for some "explorers" (yes, i'm watching at you msie) that
doesn't support ajax file uploading. Fallback in this case - loading file using
iframe. This lightweight (about 50 lines of code without dependencies)
middleware provides iframe file uploading support for server side.

## Usage

server setup, at your app.js

```js
var app = express.createServer();
app.use(express.bodyParser());

var iframeFileUpload = require('iframe-file-upload-middleware');
iframeFileUpload.addRedirectResponder(app);
app.post(/^.*\/upload$/, iframeFileUpload.middleware());
```

now you can bind your handler at some upload url e.g. '/images/upload' and
process uploads as you usually do, e.g.

```js
app.get('/images/upload', function(req, res) {
  res.json({filename: path.filename(req.files.image.path)});
});
```
client setup using [jquery file upload](http://blueimp.github.com/jQuery-File-Upload/)

```js
  $('#input[name=image]').fileupload({
    url: '/images/upload',
    redirect: 'default',
    dataType: 'json'
  }).on('fileuploaddone', function(event, data) {
    alert(data.result.filename);
  });
```

now you can upload image using file input and recives it's file name to the
client. It will work in browsers (using ajax file upload) and in explorer
using (iframe file uploading).
