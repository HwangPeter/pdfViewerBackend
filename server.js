const http = require("http");
const fs = require('fs')
const path = require('path')


let port = 1234;
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Content-Type': 'text/plain'
};

const server = http.createServer((req, res) => {

    const folderPath = __dirname + '/pdfStorage/';

    if (req.method.toLowerCase() == 'get') {
        // // GET Request, send base directory.
        let params = new URLSearchParams(req.url);
        if (params.get('/?pdf')) {
            fs.readFile(__dirname + '/pdfStorage/' + params.get('/?pdf'), function (err, data) {
                if (err) {
                    res.writeHead(404, headers);
                    res.write("Could not find that file.");
                    res.end();
                }
                else {
                    res.writeHead(200, headers);
                    res.write(data);
                    res.end();
                }
            })
        }
        else {
            let folderPaths = {};
            crawl(folderPath, folderPaths);
            res.writeHead(200, headers);
            res.write(JSON.stringify(folderPaths));
            res.end()
        }
    }
    else {
        res.writeHead(404, headers);
        res.end("<h1>Invalid request</h1>");
    }


});

function crawl(dir, parentObj) {
    var files = fs.readdirSync(dir);
    for (var x in files) {
        var next = path.join(dir, files[x]);

        if (fs.lstatSync(next).isDirectory() == true) {
            parentObj[files[x]] = {};
            crawl(next, parentObj[files[x]]);
        }
        else {
            if (files[x] !== '.DS_Store') {
                parentObj[files[x]] = true;
            }
        }
    }
}

server.listen(port, function () {
    console.log("Server running on port " + port);
});