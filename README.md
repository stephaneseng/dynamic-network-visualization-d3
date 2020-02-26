# dynamic-network-visualization-d3

Generate dynamic networks visualizations.

## Getting started

The generation is done in 2 phases:

1. First, every frame of the visualization is generated one by one
2. Then, these frames are merged together into a video

Requirements:

* [PHP](https://www.php.net) (tested with v7.2.24-0ubuntu0.18.04.3)
* [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) (tested with v10.16.2 and v6.9.0 respectively)

## 1. Frames generation

### Installation

```
$ npm install
```

### Usage

Start a local web server:

```
$ php -S 127.0.0.1:8080 -t web/
```

Then navigate to http://127.0.0.1:8080 to start the frames generation.
