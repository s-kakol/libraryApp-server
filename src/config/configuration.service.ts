import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  private readonly _dbConnectionString!: string;
  private readonly _serverPort!: number;
  private readonly _jwtSecret!: string;

  constructor(private readonly _configService: ConfigService) {
    this._dbConnectionString = this._getDbConnectionStringFromEnvFile();
    this._serverPort = this._getServerPortFromEnvFile();
    this._jwtSecret = this._getJwtSecretFromEnvFile();
  }

  get dbConnectionString(): string {
    return this._dbConnectionString;
  }

  get serverPort(): number {
    return this._serverPort;
  }

  get jwtSecret(): string {
    return this._jwtSecret;
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

  private _getJwtSecretFromEnvFile(): string {
    const jwtSecret = this._configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('No JWT secret has been provided!');
    }

    return jwtSecret;
  }
}
