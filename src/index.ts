import app from './app';

require('dotenv').config();

const port = (process.env.NODE_PORT) ? process.env.NODE_PORT : 3333;

app.listen(port, async () => {
    console.log('--------------------------------------------');
    console.log(process.env.NODE_PORT);
    for (let index = 0; index < 10; index++) console.log('\n');
    console.clear();
    console.log(`Rodando na porta ${port}`);
});
