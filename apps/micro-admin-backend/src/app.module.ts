import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL ?? ''
    ),
    MongooseModule.forFeature([{name: 'Categoria', schema: CategoriaSchema}]),
    MongooseModule.forFeature([{name: 'Jogador', schema: JogadorSchema}]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
