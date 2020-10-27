const http = require('http');

/*
const server = http.createServer();

server.on('connection', (socket)=>{
    console.log('New connection detected!');
})

server.listen(2012);
console.log('Listening on port 2012 ...');
*/

/*
const server = http.createServer((req, res)=>{
    if(req.url === '/'){
        res.write('Hello world');
        res.write('from NodeJS');
        res.write('!!!');
        res.end();
    }

    if(req.url === '/cars'){
        res.write('Car1');
        res.end();
    }
});

server.listen(3030);
console.log('Listening on port 3030...');
*/

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1> Hello everybody </h1>');
    res.write('<p> My website about cars </p>');
    res.end();
}).listen(5050);

console.log('Listening on port 5050...');