import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {
  SecureStorage,
  SecureStorageObject
} from "@ionic-native/secure-storage";

@Injectable()
export class Neo4JService {
  private authInfo: any;

  constructor(private http: Http, private secureStorage: SecureStorage) {
    this.secureStorage
      .create("laziz")
      .then((storage: SecureStorageObject) => {
        storage.get("settings").then(data => {
          if (data != null) {
            let val = JSON.parse(data);
            this.authInfo = val;
            if (this.authInfo.serverUrl.endsWith("/")) {
              this.authInfo.serverUrl = this.authInfo.serverUrl.substring(
                0,
                this.authInfo.serverUrl.length - 1
              );
            }
          }
        });
      })
      .catch(err => {
        console.error("Cannot load the secure storage engine");
      });
  }

  private query(q: string, val: any): Observable<string> {
    if (val == null) {
      val = this.authInfo;
    }
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: "Basic " + window.btoa(val.username + ":" + val.password)
    });
    let options = new RequestOptions({
      headers: _headers
    });
    let results = this.http
      .post(
        val.serverUrl + "/db/query",
        {
          query: q
          //"MATCH (x)-[r:INGREDIENT]->(y)  RETURN y.name,r.quantity, r.unit"
        },
        options
      )
      .map(this.queryResuts)
      .catch((err: any) => {
        return Observable.of(undefined);
      });

    return results;
  }

  private queryResuts(response: Response): string {
    return response.json();
  }

  public ping(authInfo: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.query(
        "match (n) return count(n)",
        authInfo
      ).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject("cannot connect to server.");
        } else {
          resolve("pong");
        }
      });
    });
  }

  public select(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.query(query, null).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject("something is wrong with your query.");
        } else {
          resolve(queryResults);
        }
      });
    });
  }
}
