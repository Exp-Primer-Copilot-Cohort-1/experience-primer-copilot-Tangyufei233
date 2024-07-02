// Create web server
const http = require('http');
const fs = require('fs');
const comments = require('./comments');

const server = http.createServer((req, res) => {
    if (req.url === '/comments' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(comments));
    } else if (req.url === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const comment = JSON.parse(body);
            comments.push(comment);
            fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error saving comment');
                    return;
                }
                res.writeHead(201);
                res.end(JSON.stringify(comment));
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});