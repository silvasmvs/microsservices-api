import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CriarCategoriaDto {
    @IsString()
    @IsNotEmpty()
    readonly categoria: string;
    
    @IsString()
    @IsNotEmpty()
    descricao: string;

    @IsArray()
    @ArrayMinSize(1)
    eventos: Evento[]
}

export interface Evento {
    nome: string;
    operacao: string;
    valor: number;
}