# dynamic-network-visualization-d3

Generate dynamic networks visualizations.

## Getting started

The generation is done in 2 phases, in a somewhat unconventional way:

1. First, every frame of the visualization is generated one by one
2. Then, these frames are merged together into a video

### 0. Requirements

* [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) (tested with v10.16.2 and v6.9.0 respectively)
* [PHP](https://www.php.net) (tested with v7.2.24-0ubuntu0.18.04.3)
* [SQLite](https://www.sqlite.org/index.html) (tested with v3.22.0)

### 1. Data preparation

The graph data in the CSV files have to be imported into a SQLite database so that it can be fetched by the application at runtime:

```
$ sqlite3 var/data/sqlite.db <<EOF

CREATE TABLE nodes (date DATE, id INTEGER);
CREATE TABLE links (date DATE, source INTEGER, target INTEGER);

.mode csv
.separator ","
.import var/data/nodes.csv nodes
.import var/data/links.csv links

CREATE INDEX index_nodes_date ON nodes (date);
CREATE INDEX index_links_date ON links (date);

EOF
```

### 2. Frames generation

#### a. Installation

```
$ npm install
```

#### b. Usage

Start a local web server:

```
$ php -S 127.0.0.1:8080 -t web/
```

Then navigate to http://127.0.0.1:8080 to start the frames generation.
