import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Categoria } from './interfaces/categorias/categoria.interface';
import { Jogador } from './interfaces/jogadores/jogador.interface';

@Injectable()
export class AppService {
  constructor(
      @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
      @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async criarCategoria(categoria: Categoria): Promise<Categoria> {
      try {
        const categoriaCriada = new this.categoriaModel(categoria);
        return await categoriaCriada.save();
      } catch(error) {
        this.logger.error(`error: ${JSON.stringify(error.message)}`);
        throw new RpcException(error.message);
      }
  }

  async atualizarCategoria(_id: string, categoria: Categoria): Promise<void> {
    try {
      await this.categoriaModel.findOneAndUpdate({_id}, {$set: categoria}).exec();
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodos(): Promise<Categoria[]> {
    return this.categoriaModel.find().populate("jogadores").exec();
  }
  
  async consultarPeloId(_id: string): Promise<Categoria> {
    const categoriaEncontrada =  await this.categoriaModel.findOne({ _id }).exec();

    if(!categoriaEncontrada) {
        throw new NotFoundException(`Categoria com id ${_id} não encontrada`);
    }

    return categoriaEncontrada;
  }
}
