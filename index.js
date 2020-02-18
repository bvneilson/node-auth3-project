const express = require('express');

const port = 5011;
const server = express();

server.use(express.json());

server.listen(port, () => console.log(`Server listening on port ${port}`))
