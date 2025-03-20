import { Body, Controller, Get, Logger, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Observable } from 'rxjs';

@Controller('api/v1')
export class AppController {
  private clientAdminBackend: ClientProxy

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      // @ts-ignore
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);


  }

  @Get('categorias')
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }
}
