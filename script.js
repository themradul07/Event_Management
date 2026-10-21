// Polyfill for SlowBuffer removed in Node 24/25/26+
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}
if (typeof global !== 'undefined' && !global.SlowBuffer) {
    global.SlowBuffer = buffer.Buffer;
}

// Root entrypoint alias for deployment environments configured with "node script.js"
require('./backend/index.js');
