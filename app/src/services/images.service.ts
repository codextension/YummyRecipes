import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";
import {
  SecureStorage,
  SecureStorageObject
} from "@ionic-native/secure-storage";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { FileEntry } from "@ionic-native/file";
import { AuthInfo } from "./auth-info";

@Injectable()
export class ImagesService {
  private fileTransfer: FileTransferObject;

  constructor(
    private transfer: FileTransfer,
    private http: Http,
    private secureStorage: SecureStorage,
    private platform: Platform,
    private storage: Storage
  ) {
    this.fileTransfer = this.transfer.create();
  }

  private withCredentials(): Promise<AuthInfo> {
    return new Promise((resolve, reject) => {
      let authInfo: AuthInfo;
      if (this.platform.is("core")) {
        this.storage
          .get("settings")
          .then((val: AuthInfo) => {
            if (val == null) {
              reject("empty authentication not allowed");
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
                }
                reject("no auth information");
              })
              .catch(err => {
                reject("no auth information");
              });
          })
          .catch(err => {
            console.error("Cannot load the secure storage engine");
          });
      }
    });
  }

  public save(fileUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.withCredentials().then((val: AuthInfo) => {
        window.resolveLocalFileSystemURL(fileUri, (fileEntry: FileEntry) => {
          fileEntry.file(success => {
            console.log(success.localURL);
          });
          this.fileTransfer
            .upload(
              fileEntry.toInternalURL(),
              val.serverUrl + "/images/upload",
              {
                headers: {
                  authorization:
                    "Basic " + window.btoa(val.username + ":" + val.password)
                },
                chunkedMode: true,
                fileKey: "recipe_img"
              },
              true
            )
            .then(res => {
              console.info(res);
              let imgUrl =
                val.serverUrl +
                "/images/get/" +
                JSON.parse(res.response).filename;
              resolve(imgUrl);
            })
            .catch(err => {
              console.error(err);
            });
        });
      });
    });
  }

  public upload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.withCredentials().then((val: AuthInfo) => {
        let formData: FormData = new FormData();
        formData.append("recipe_img", file, file.name);
        let headers = new Headers();
        headers.append(
          "authorization",
          "Basic " + window.btoa(val.username + ":" + val.password)
        );
        let options = new RequestOptions({ headers: headers });
        this.http
          .post(val.serverUrl + "/images/upload", formData, options)
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .subscribe(
            data => {
              let imgUrl = val.serverUrl + "/images/get/" + data.filename;
              resolve(imgUrl);
            },
            error => reject(error)
          );
      });
    });
  }

  private uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
