import { networkInterfaces } from 'os';
import {app} from './serveur';
import {env} from './config/env.config';

const getLocalIps = () =>
    Object.values(networkInterfaces())
        .flat()
        .filter((iface) => iface && iface.family === 'IPv4' && !iface.internal)
        .map((iface) => iface!.address);

app.listen({port: env.PORT}, () => {
    console.log(`Server is running on port ${env.PORT}`);
    getLocalIps().forEach((ip) => {
        console.log(`  -> http://${ip}:${env.PORT}`);
    });
})