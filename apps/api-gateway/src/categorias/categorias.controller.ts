import { Controller, Get, Logger, Post, UsePipes, ValidationPipe, Body, Query, Put, Param } from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto'
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy'
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/categorias')
export class CategoriasController {

  private logger = new Logger(CategoriasController.name);
  private clientAdminBackend: ClientProxy;

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking
  ) {
    this.clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  
  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto){

      this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)

  }

  @Get()
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {

    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '')

  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)    
  atualizarCategoria(@Body() atualizarCategoriaDto: AtualizarCategoriaDto,
         @Param('_id') _id: string) {
          this.clientAdminBackend.emit('atualizar-categoria', 
          { id: _id, categoria: atualizarCategoriaDto }) 
         }    

}
