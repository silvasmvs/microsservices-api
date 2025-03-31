import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './jogadores/interfaces/jogador.schema';
import { CategoriaSchema } from './categorias/interfaces/categoria.schema';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? ''
    ),
    MongooseModule.forFeature([{name: 'Categoria', schema: CategoriaSchema}]),
    MongooseModule.forFeature([{name: 'Jogador', schema: JogadorSchema}]),
    CategoriasModule,
    JogadoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
