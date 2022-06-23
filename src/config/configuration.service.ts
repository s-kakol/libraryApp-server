import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  private readonly _dbConnectionString!: string;
  private readonly _serverPort!: number;

  constructor(private readonly _configService: ConfigService) {
    this._dbConnectionString = this._getDbConnectionStringFromEnvFile();
    this._serverPort = this._getServerPortFromEnvFile();
  }

  get dbConnectionString(): string {
    return this._dbConnectionString;
  }

  get serverPort(): number {
    return this._serverPort;
  }

  private _getDbConnectionStringFromEnvFile(): string {
    const dbConnectionString = this._configService.get<string>('MONGODB_URI');
    if (!dbConnectionString) {
      throw new Error('No connection string has been provided');
    }

    return dbConnectionString;
  }

  private _getServerPortFromEnvFile(): number {
    const serverPort = Number(this._configService.get<string>('PORT'));
    if (!serverPort) {
      throw new Error('No port number has been provided');
    }

    return serverPort;
  }
}
