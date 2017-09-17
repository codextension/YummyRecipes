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

@Injectable()
export class ImagesService {
  private restEntryPointUrl: string;
  private authString: string;
  private fileTransfer: FileTransferObject;

  constructor(
    private transfer: FileTransfer,
    private file: File,
    private http: Http,
    private secureStorage: SecureStorage
  ) {
    this.fileTransfer = this.transfer.create();

    this.secureStorage
      .create("laziz")
      .then((storage: SecureStorageObject) => {
        storage.get("settings").then(data => {
          if (data != null) {
            let val = JSON.parse(data);
            if (val.serverUrl.endsWith("/")) {
              val.serverUrl = val.serverUrl.substring(
                0,
                val.serverUrl.length - 1
              );
            }
            this.restEntryPointUrl = val.serverUrl + "/images";
            this.authString =
              "Basic " + window.btoa(val.username + ":" + val.password);
          }
        });
      })
      .catch(err => {
        console.error("Cannot load the secure storage engine");
        this.restEntryPointUrl = "https://localhost:3443/images";
        this.authString = "Basic " + window.btoa("elie:pwd");
      });
  }

  public save(fileUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(fileUri, (fileEntry: FileEntry) => {
        fileEntry.file(success => {
          console.log(success.localURL);
        });
        this.fileTransfer
          .upload(
            fileEntry.toInternalURL(),
            this.restEntryPointUrl + "/upload",
            {
              headers: { authorization: this.authString },
              chunkedMode: true,
              fileKey: "recipe_img",
              fileName: fileEntry.name
            },
            true
          )
          .then(res => {
            console.info(res);
            let imgUrl =
              this.restEntryPointUrl +
              "/get/" +
              JSON.parse(res.response).originalname;
            resolve(imgUrl);
          })
          .catch(err => {
            console.error(err);
          });
      });
    });
  }
}
