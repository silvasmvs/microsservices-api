import { Document } from "mongoose";

export interface Jogador extends Document{
    readonly telefoneCelular: string;
    readonly email: string;
    nome: string;
    ranking: string;
    posicaoranking: number;
    urlFotoJogador: string;
}