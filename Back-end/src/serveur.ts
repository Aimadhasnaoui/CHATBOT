import express  from 'express';
import response from '../src/Routes/Response'
import coversationRouter from '../src/Routes/coversationRouter'
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World');
}
)
app.use('/exchange',response)
app.use('/Conversation',coversationRouter)
export { app };
export default app;
