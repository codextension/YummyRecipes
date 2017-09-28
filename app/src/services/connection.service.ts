import {AuthInfo} from "./auth-info";
import {SecureStorage, SecureStorageObject} from "@ionic-native/secure-storage";
import {Platform} from "ionic-angular";
import {Injectable} from "@angular/core";
import {ErrorType, InternalError} from "./internal-error";
import {Storage} from "@ionic/storage";

@Injectable()
export class ConnectionService {
    constructor(private secureStorage: SecureStorage,
                private platform: Platform,
                private storage: Storage) {
    }

    public withCredentials(): Promise<AuthInfo> {
        return new Promise((resolve, reject) => {
            let authInfo: AuthInfo;
            if (this.platform.is("core")) {
                this.storage
                    .get("settings")
                    .then((val: AuthInfo) => {
                        if (val == null) {
                            let err: InternalError = new InternalError("empty authentication not allowed", ErrorType.EMPTY_AUTH);
                            err.name = "EMPTY_AUTH";
                            reject(err);
                        } else {
                            resolve(val);
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                this.secureStorage
                    .create("laziz")
                    .then((storage: SecureStorageObject) => {
                        storage
                            .get("settings")
                            .then(data => {
                                if (data != null) {
                                    let val = JSON.parse(data);
                                    authInfo = val;
                                    if (authInfo.serverUrl.endsWith("/")) {
                                        authInfo.serverUrl = authInfo.serverUrl.substring(
                                            0,
                                            authInfo.serverUrl.length - 1
                                        );
                                    }
                                    resolve(authInfo);
                                } else {
                                    let err: InternalError = new InternalError("empty authentication not allowed", ErrorType.EMPTY_AUTH);
                                    err.name = "EMPTY_AUTH";
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