import {app} from './serveur';
import {env} from './config/env.config';
app.listen({port: env.PORT}, () => {
    console.log(`Server is running on port ${env.PORT}`);
})