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
  
  winston.info(
        'mymetric.category_1 100'
    );
    
  // or  
  
  winston.info('mymetric.category_1', {value: 100, timestamp: 1435708800});
```

### Performance
It currenlty works on our infrastructure, and processes about 500K datapoints per minute
[![Sample Graphic](http://cdn48.picsart.com/175591406001201.png?r1024x1024)](http://cdn48.picsart.com/175591406001201.png?r1024x1024)



#### License: MIT

See LICENSE for the full license text.

[0]: http://graphite.wikidot.com/
[1]: https://github.com/flatiron/winston
