import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CategoriasModule,
    JogadoresModule,
    ProxyRMQModule,
    AwsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
