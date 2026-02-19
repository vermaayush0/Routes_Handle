const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 5000;
const FILE_NAME = "notes.txt";

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Route 1: Add note
    if (pathname === "/add") {

        const note = parsedUrl.query.note;

        if (!note) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("400 Bad Request");
            return;
        }

        fs.appendFile(FILE_NAME, note + "\n", (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error saving note");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Note Added Successfully");
        });
    }

    // Route 2: Get all notes
    else if (pathname === "/notes") {

        fs.readFile(FILE_NAME, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error reading notes");
                return;
            }

            if (!data.trim()) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("No Notes Found");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }

    // Route 3: Clear notes
    else if (pathname === "/clear") {

        fs.writeFile(FILE_NAME, "", (err) => {

            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error clearing notes");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("All Notes Deleted");
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route Not Found");
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
