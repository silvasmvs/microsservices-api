import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
    private readonly logger = new Logger(AwsService.name);

    constructor(private readonly configService: ConfigService) {}

    public async uploadArquivo(file: any, id: string) {
        const AWS_ACCESS_KEY_ID = this.configService.get('AWS_ACCESS_KEY_ID');
        const AWS_SECRET_ACCESS_KEY = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const AWS_REGION = this.configService.get('AWS_REGION');
        const AWS_BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');

        const s3 = new AWS.S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
        });

        console.log({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
        })

        const fileExtension = file.originalname.split('.').pop();
        const Key = `${id}.${fileExtension}`;
        this.logger.log('Key', Key);

        if (!AWS_BUCKET_NAME) {
            throw new Error('AWS_BUCKET_NAME is not defined in the environment variables');
        }

        const params = {
            Body: file.buffer,
            Bucket: AWS_BUCKET_NAME,
            Key
        };

        console.log('params', params);

        const data = s3
            .putObject(params)
            .promise()
            .then((data) => {
                this.logger.log('Arquivo enviado com sucesso para o S3');
                return {
                    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`,
                }
            })
            .catch((err) => {
                this.logger.error('Erro ao enviar arquivo para o S3', err);
            });

        return data;
    }
}
