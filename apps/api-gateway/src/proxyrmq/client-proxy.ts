import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxySmartRanking {
    getClientProxyAdminBackendInstance(): ClientProxy {
        return ClientProxyFactory.create({
            // @ts-ignore
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL],
                queue: 'admin-backend'
            }
        })
    }
}