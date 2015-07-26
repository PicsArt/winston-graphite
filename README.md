# winston-graphite
Graphite transport for NodeJS winston logging library

[![Build Status](https://travis-ci.org/PicsArt/winston-graphite.png?branch=master)](https://travis-ci.org/PicsArt/winston-graphite)


## Installation
``` npm install winston-graphite ```

A [Graphite TCP][0] transport for [winston][1].

## Usage

### Node

``` js
  var winston = require('winston');

  //
  // Requiring `winston-graphite` will expose
  // `winston.transports.Graphite`
  //
  require('winston-graphite');

  winston.add(winston.transports.Graphite, {
    port: 2003,
    host: '127.0.0.1'
  });
```

#### License: MIT

See LICENSE for the full license text.

[0]: http://graphite.wikidot.com/
[1]: https://github.com/flatiron/winston
