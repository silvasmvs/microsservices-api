import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';

@Module({
  imports: [CategoriasModule, JogadoresModule, ProxyRMQModule],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
