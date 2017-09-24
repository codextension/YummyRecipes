import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {
  SecureStorage,
  SecureStorageObject
} from "@ionic-native/secure-storage";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File, FileEntry } from "@ionic-native/file";
import { AuthInfo } from "./auth-info";

@Injectable()
export class ImagesService {
  private fileTransfer: FileTransferObject;

  constructor(
    private transfer: FileTransfer,
    private file: File,
    private http: Http,
    private secureStorage: SecureStorage
  ) {
    this.fileTransfer = this.transfer.create();
  }

  private withCredentials(): Promise<AuthInfo> {
    return new Promise((resolve, reject) => {
      let authInfo: AuthInfo;
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
          reject("no auth information");
          console.error("Cannot load the secure storage engine");
        });
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

  private uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
