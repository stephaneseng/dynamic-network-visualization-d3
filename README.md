# dynamic-network-visualization-d3

Generate dynamic networks visualizations using [D3.js](https://d3js.org).

## Getting started

The generation is done in 2 phases, in a somewhat unconventional way:

1. First, every frame of the visualization is generated one by one
2. Then, these frames are merged together into a video

### 0. Requirements

* [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) (tested with v10.16.2 and v6.9.0 respectively)
* [PHP](https://www.php.net) (tested with v7.2.24-0ubuntu0.18.04.3)
* [SQLite](https://www.sqlite.org/index.html) (tested with v3.22.0)

### 1. Data preparation

An example dataset provided in [nodes.csv](var/data/nodes.csv) and [links.csv](var/data/links.csv) has been generated from the [Bitcoin Alpha trust weighted signed network](http://snap.stanford.edu/data/soc-sign-bitcoin-alpha.html) distributed by the [Stanford Network Analysis Project](http://snap.stanford.edu/index.html), using the following script:

```
$ sqlite3 <<EOF

CREATE TABLE dataset (source INTEGER, target INTEGER, rating INTEGER, time INTEGER);
CREATE TABLE nodes (date DATE, id INTEGER);
CREATE TABLE links (date DATE, source INTEGER, target INTEGER);

.mode csv
.separator ","
.import soc-sign-bitcoinalpha.csv dataset

INSERT INTO nodes
SELECT MIN(date) date, id FROM
(
    SELECT DATE(time, 'unixepoch') date, source id FROM dataset
    UNION
    SELECT DATE(time, 'unixepoch') date, target id FROM dataset
)
GROUP BY id
ORDER BY MIN(date);

INSERT INTO links
SELECT MIN(DATE(time, 'unixepoch')) date, source, target FROM dataset
GROUP BY source, target
ORDER BY MIN(DATE(time, 'unixepoch'));

.headers on
.separator ","
.once var/data/nodes.csv
SELECT date, id FROM nodes;

.once var/data/links.csv
SELECT date, source, target FROM links;

EOF
```

Once these CSV files are ready, these still have to be imported into a SQLite database that will be accessed by the application at runtime:

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

Using the example dataset and the example configuration parameters, this will generate the frames for the events happening between 2010-11-01 and 2011-11-01.

## References

* J. Leskovec, A. Krevl. SNAP Datasets: Stanford Large Network Dataset Collection. http://snap.stanford.edu/data, 2014
* S. Kumar, F. Spezzano, V.S. Subrahmanian, C. Faloutsos. Edge Weight Prediction in Weighted Signed Networks. IEEE International Conference on Data Mining (ICDM), 2016
* S. Kumar, B. Hooi, D. Makhija, M. Kumar, V.S. Subrahmanian, C. Faloutsos. REV2: Fraudulent User Prediction in Rating Platforms. 11th ACM International Conference on Web Searchand Data Mining (WSDM), 2018
