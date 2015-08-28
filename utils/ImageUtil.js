module.exports = function() {
  'use strict';
  var request = require('request');
  var Jimp = require('jimp');
  var FileType = require('file-type');
  var q = require('q');
  var ImageUtil = {};

  ImageUtil.resize = function(url) {
    var deferrer = q.defer();

    //TODO: Fix or use another service to resize the images
    // var processFile = function(error, res, body) {
    //   if (error) {
    //     console.log(error);
    //     deferrer.reject();
    //   } else {
    //     var buffer = new Buffer(body, 'binary');
    //     var image = new Jimp(buffer, function(e, image) {
    //       var mimeType = FileType(buffer).mime;
    //       if (e) {
    //         console.log(e);
    //         deferrer.reject();
    //       } else {
    //         var w = 700; //iPhone 6
    //         if (image.bitmap.width > w) {
    //           var h = (w * image.bitmap.height) / image.bitmap.width;
    //           image.resize(w, h);
    //         }
    //         image.quality(70);
    //         image.getBuffer(mimeType, function(e, buffer) {
    //           if (e) {
    //             console.log(e);
    //             deferrer.reject();
    //           } else {
    //             deferrer.resolve(buffer, mimeType);
    //           }
    //         });
    //       }
    //     });
    //   }
    // };
    //
    // request({
    //   url: url,
    //   encoding: null
    // }, processFile);


    //To transform into base64 (after buffer download):
    // var data_uri_prefix = "data:" + mimeType + ";base64,";
    // var image = buffer.toString("base64");
    // image = data_uri_prefix + image;
    // entry.image.base64 = image;

    deferrer.resolve();
    return deferrer.promise;
  };

  return ImageUtil;
};
