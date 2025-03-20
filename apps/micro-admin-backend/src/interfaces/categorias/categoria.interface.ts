import { Document } from 'mongoose';
import { Jogador } from '../jogadores/jogador.interface';

export interface Categoria extends Document {
    readonly categoria: string;
    descricao: string;
    eventos: Evento[];
    jogadores: Jogador[];
}

export interface Evento {
    nome: string;
    operacao: string;
    valor: number;
}