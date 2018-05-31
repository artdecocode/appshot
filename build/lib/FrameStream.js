"use strict";

/**
 * update decoder:

  for (var i = 0; i < scanline.length; i++) {
    const val = scanline[i]
    if (val == this._frame.transparentColor) {
      res[p++] = -1
      res[p++] = -1
      res[p++] = -1
    } else {
      var idx = scanline[i] * 3;
      res[p++] = this._palette[idx];
      res[p++] = this._palette[idx + 1];
      res[p++] = this._palette[idx + 2];
    }
  }

  update encoder:

  GIFEncoder.prototype._writeGCE = function(frame) {
    var buf = new Buffer(8);
    var delay = (frame.delay || 50) / 10 | 0;
    var tc = frame.transparentColor || 0

    buf[0] = 0x21;               // extension block
    buf[1] = 0xf9;               // graphic control extension
    buf[2] = 4;                  // block size
    buf[3] = 0;                  // flags
    buf.writeUInt16LE(delay, 4); // frame delay
    buf[6] = tc;                 // transparent color index
    buf[7] = 0;                  // block terminator

    this.push(buf);
  };

 */

/* eslint-disable */
// unused
class FrameStream extends Transform {
  constructor({
    delay,
    file,
    repeatCount = Infinity
  }) {
    super({
      objectMode: true
    });
    this.delay = delay;
    this.encodeStream = new GIFEncoder({
      repeatCount
    });
    this.setup = false;
    this.file = file;
    this.i = 1;
  }

  _transform(frame, enc, next) {
    if (!this.setup) {
      LOG('Setting up encode stream');
      const outputStream = getOutputStream(this.file).on('close', () => {
        this.push(null);
      }).on('error', error => {
        next(error);
      });
      this.encodeStream.pipe(outputStream);
      this.encodeStream.on('error', err => {
        next(err);
      }).on('end frame', () => {
        LOG('written pixels');
        this.emit('end frame', this.i);
        this.i++;
        next();
      });
      this.setup = true;
    }

    frame.delay = this.delay;
    this.encodeStream.addFrame(frame);
    LOG('writing frame %s', this.i);
    this.encodeStream.write(frame.pixels);
  }

  _end() {
    if (!this.setup) return;
    this.encodeStream.end();
  }

}
//# sourceMappingURL=FrameStream.js.map