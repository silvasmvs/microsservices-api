import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxySmartRanking {
    constructor(private readonly configService: ConfigService) {}
    
    getClientProxyAdminBackendInstance(): ClientProxy {
        const RABBITMQ_URL = this.configService.get('RABBITMQ_URL');

        return ClientProxyFactory.create({
            // @ts-ignore
            transport: Transport.RMQ,
            options: {
                urls: [RABBITMQ_URL],
                queue: 'admin-backend'
            }
        })
    }
}