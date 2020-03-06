const server = require('./server.js');
const port = 3006;

server.listen(port, () => console.log(`Server listening on port ${port}`))
