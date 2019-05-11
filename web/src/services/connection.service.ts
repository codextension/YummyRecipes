import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ErrorType, InternalError } from './internal-error';
import { AuthInfo } from './auth-info';
import { SecureStorageOriginal, SecureStorageObject } from '@ionic-native/secure-storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private secureStorage: SecureStorageOriginal,
              private platform: Platform,
              private storage: Storage) { }


              public withCredentials(): Promise<AuthInfo> {
                return new Promise((resolve, reject) => {
                    let authInfo: AuthInfo;
                    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
                        this.storage
                            .get('settings')
                            .then((val: AuthInfo) => {
                                if (val == null) {
                                    const err: InternalError = new InternalError('empty authentication not allowed', ErrorType.EMPTY_AUTH);
                                    err.name = 'EMPTY_AUTH';
                                    reject(err);
                                } else {
                                    resolve(val);
                                }
                            })
                            .catch(ex => {
                                const err: InternalError = new InternalError('empty authentication not allowed', ErrorType.EMPTY_AUTH);
                                err.name = 'EMPTY_AUTH';
                                reject(err);
                            });
                    } else {
                        this.secureStorage
                            .create('laziz')
                            .then((storage: SecureStorageObject) => {
                                storage
                                    .get('settings')
                                    .then(data => {
                                        if (data != null) {
                                            const val = JSON.parse(data);
                                            authInfo = val;
                                            if (authInfo.serverUrl.endsWith('/')) {
                                                authInfo.serverUrl = authInfo.serverUrl.substring(
                                                    0,
                                                    authInfo.serverUrl.length - 1
                                                );
                                            }
                                            resolve(authInfo);
                                        } else {
                                            const err: InternalError = new InternalError('empty authentication not allowed',
                                            ErrorType.EMPTY_AUTH);
                                            err.name = 'EMPTY_AUTH';
                                            reject(err);
                                        }
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                });
            }
}
