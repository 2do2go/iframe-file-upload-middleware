# Iframe file upload helper for expressjs

express framework already provides convenient way for uploading files using
bodyParser. Ajax file uploading works greate at modern browsers but we
need a fallback for some "explorers" (yes, i'm watching at you msie) that
doesn't support ajax file uploading. Fallback in this case - loading file using
iframe. This lightweight (about 50 lines of code without dependencies)
middleware provides iframe file uploading support for server side.

