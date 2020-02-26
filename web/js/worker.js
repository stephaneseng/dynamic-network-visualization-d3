importScripts('/js/d3.min.js');

const TICKS_PER_SIMULATION = 60;

let date;
const nodes = [];
const links = [];

var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-10))
    .force('link', d3.forceLink(links).id(d =>  d.id).distance(20))
    .force('center', d3.forceCenter())
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .alphaDecay(1 - Math.pow(0.001, 1 / TICKS_PER_SIMULATION))
    .stop();

onmessage = function(event) {
    date = event.data.date;
    event.data.nodes.forEach(node => nodes.push(node));
    event.data.links.forEach(link => links.push(link));

    simulation.nodes(nodes);
    simulation.force('link').links(links);
    simulation.alpha(1);
    simulation.stop();

    var tick = 0;
    while (simulation.alpha() > simulation.alphaMin()) {
        simulation.tick();
        postMessage({ type: 'tick', date: date, nodes: simulation.nodes(), links: simulation.force('link').links(), tick: tick++ });
    }

    postMessage({ type: 'end', date: date });
};
