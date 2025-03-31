import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasService } from './categorias.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriasService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError));

      if(filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.categoriasService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMessage);

    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError));

      if(filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if(_id) {
        return await this.categoriasService.consultarPeloId(_id);
      }
  
      return await this.categoriasService.consultarTodos();
    } finally {
      await channel.ack(originalMessage);
    }
    
  }
}
