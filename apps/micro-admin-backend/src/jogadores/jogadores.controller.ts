import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador')
  async criarJogador(
    @Payload() jogador: Jogador,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

    try {
      await this.jogadoresService.criarJogador(jogador);
      await channel.ack(originalMessage);
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError));

      if(filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarCategoria(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadoresService.atualizarJogador(_id, jogador);
      await channel.ack(originalMessage);

    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error)}`)
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError));

      if(filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if(_id) {
        return await this.jogadoresService.consultarJogadorPeloId(_id);
      }
  
      return await this.jogadoresService.consultarTodosJogadores();
    } finally {
      await channel.ack(originalMessage);
    }
    
  }
}
