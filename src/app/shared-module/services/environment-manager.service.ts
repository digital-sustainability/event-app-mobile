import { Injectable } from '@angular/core';

declare var process: any;

@Injectable({ providedIn: 'root'})
export class EnvironmentManagerService {
  private getEnvironmentVars(key: string): string {
    if (typeof process !== 'undefined' && process && process.env) {
      return process.env[key];
    } else {
      return '';
    }
  }

  public getEventApi(): string {
    return this.getEnvironmentVars('eventApi');
  }

  public isDev(): boolean {
    return this.getEnvironmentVars('envtype') === 'dev';
  }
}
