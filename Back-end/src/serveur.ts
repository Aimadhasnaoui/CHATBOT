import express  from 'express';
import response from '../src/Routes/Response'
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
}
)
app.use('/Conversation',response)
export { app };
export default app;