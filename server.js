const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}...`));

io.on('connection', (socket) => console.log('Пользователь подключен'));
