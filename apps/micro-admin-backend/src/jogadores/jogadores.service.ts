import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Jogador } from './interfaces/jogador.interface';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
    constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

    private readonly logger = new Logger(JogadoresService.name);

    async criarJogador(criarJogadorDto: Jogador): Promise<Jogador> {
        const { email } = criarJogadorDto;

        const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

        if(jogadorEncontrado) {
            throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
        } 

        const jogadorCriado = new this.jogadorModel(criarJogadorDto);

        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: Jogador): Promise<void> {
        const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }

        await this.jogadorModel.findOneAndUpdate({ _id }, { $set: atualizarJogadorDto}).exec();
    }

    async deletarJogador(_id: string): Promise<void> {
        const jogadorEncontrado =  await this.jogadorModel.findOne({ _id }).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }
        
        await this.jogadorModel.deleteOne({ _id });
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return this.jogadorModel.find().exec();
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        const jogadorEncontrado =  await this.jogadorModel.findOne({ _id }).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }

        return jogadorEncontrado;
    }
}
