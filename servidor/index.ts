import express, { Request, Response } from 'express';
import cors from 'cors';

const clients: Response[] = [];

const app = express();
app.use(express.json());
app.use(cors());


app.get('/eventos', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
        res.end();
    });
});

app.post('/notificaciones', (req: Request, res: Response) => {
    const { message } = req.body;
    clients.forEach(client => client.write(`event: notificacion\ndata: ${message}\n\n`));
    res.status(201).json({ success: true });
});

app.post('/mensajes', (req: Request, res: Response) => {
    const { message } = req.body;
    clients.forEach(client => client.write(`event: mensaje\ndata: ${message}\n\n`));
    res.status(201).json({ success: true });
});

app.post("/alertas",(req: Request, res: Response)=>{
    const {message} = req.body;
    clients.forEach(client => client.write(`event: alerta\ndata: ${message}\n\n`));
    res.status(201).json({succes: true});
})


app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
 