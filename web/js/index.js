const START_DATE = new Date(Date.UTC(2010, 9, 1, 0, 0));
const END_DATE = new Date(Date.UTC(2011, 10, 1, 0, 0));

const canvas = d3.select('canvas');
const width = +canvas.attr('width');
const halfWidth = width / 2;
const height = +canvas.attr('height');
const halfHeight = height / 2;
const context = canvas.node().getContext('2d');
context.translate(halfWidth, halfHeight);

const worker = new Worker('/js/worker.js');
worker.onmessage = function(event) {
    switch (event.data.type) {
        case 'end': return onEnd(event.data);
        case 'tick': return onTick(event.data);
    }
};

// Start the simulation.
onEnd({ date : START_DATE });

function onEnd(data) {
    console.log('onEnd: ' + data.date.toJSON().substring(0, 10));

    const from = new Date(data.date.getTime());
    const to = new Date(data.date.getTime());

    from.setUTCMonth(from.getUTCMonth() + 1);
    to.setUTCMonth(to.getUTCMonth() + 2);
    if (from.getTime() > END_DATE.getTime()) {
        return;
    }

    d3.json('/php/get.php' + '?from=' + from.toJSON().substring(0, 10) + '&to=' + to.toJSON().substring(0, 10))
        .then((data) => {
            // (Re)start the simulation.
            worker.postMessage({ date: from, nodes: data.nodes, links: data.links });
        });
}

function onTick(data) {
    console.log('onTick: ' + data.date.toJSON().substring(0, 10) + '-' + data.tick);

    // Background.
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillRect(-halfWidth, -halfHeight, width, height);

    // Draw links.
    context.strokeStyle = 'rgba(204, 204, 204, 0.2)';
    context.beginPath();
    data.links.forEach(function(d) {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
    });
    context.stroke();

    // Draw nodes.
    context.fillStyle = 'rgb(0, 0, 0)';
    context.beginPath();
    data.nodes.forEach(function(d) {
        context.moveTo(d.x, d.y);
        context.arc(d.x, d.y, 2, 0, 2 * Math.PI);
    });
    context.fill();

    // Save to a file.
    const canvasData = canvas.node().toDataURL().substring(22);
    d3.text('/php/post.php?date=' + data.date.toJSON().substring(0, 10) + '&tick=' + data.tick, {
        method: 'POST',
        header: 'Content-Type: text/plain',
        body: canvasData
    });
}
