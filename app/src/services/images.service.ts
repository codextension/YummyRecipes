import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {
  SecureStorage,
  SecureStorageObject
} from "@ionic-native/secure-storage";

@Injectable()
export class ImagesService {
  private restEntryPointUrl: string;
  private authString: string;

  constructor(private http: Http, private secureStorage: SecureStorage) {
    // this.restEntryPointUrl = "https://localhost:3443/images";

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
              this.restEntryPointUrl = val.serverUrl + "/images";
              this.authString =
                "Basic " + window.btoa(val.username + ":" + val.password);
            }
          }
        });
      })
      .catch(err => {
        console.error("Cannot load the secure storage engine");
      });
  }

  public save(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let _headers = new Headers({
        authorization: this.authString
      });
      let options = new RequestOptions({
        headers: _headers
      });
      this.http
        .post(this.restEntryPointUrl + "/save", { data: base64Image }, options)
        .subscribe(val => {
          resolve(this.restEntryPointUrl + "/get/" + val.json().name);
        });
    });
  }
}
