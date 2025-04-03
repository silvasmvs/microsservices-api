import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forRoot(
       process.env.DATABASE_URL ?? ''
    ),
    CategoriasModule,
    JogadoresModule,
    ConfigModule.forRoot({isGlobal: true}),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
