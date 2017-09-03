import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";

@Injectable()
export class ImagesService {
  private restEntryPointUrl: string;
  private authString: string;

  constructor(private http: Http, private storage: Storage) {
    // this.restEntryPointUrl = "https://localhost:3443/images";
    this.storage.get("settings").then(val => {
      if (val != null) {
        this.restEntryPointUrl = val.serverUrl + "/images";
        this.authString =
          "Basic " + window.btoa(val.username + ":" + val.password);
      }
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
      let results = this.http
        .post(this.restEntryPointUrl + "/save", { data: base64Image }, options)
        .subscribe(val => {
          resolve(this.restEntryPointUrl + "/get/" + val.json().name);
        });
    });
  }
}
