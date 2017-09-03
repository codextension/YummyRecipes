import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";

@Injectable()
export class Neo4JService {
  private restEntryPointUrl: string;
  private authString: string;

  constructor(private http: Http, private storage: Storage) {
    //this.restEntryPointUrl = "https://localhost:3443/db/query";
    this.storage.get("settings").then(val => {
      if (val != null) {
        this.restEntryPointUrl = val.serverUrl + "/db/query";
        this.authString =
          "Basic " + window.btoa(val.username + ":" + val.password);
      }
    });
  }

  private query(q: string): Observable<string> {
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: this.authString
    });
    let options = new RequestOptions({
      headers: _headers
    });
    let results = this.http
      .post(
        this.restEntryPointUrl,
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

  public select(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.query(query).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject("something is wrong with your query.");
        } else {
          resolve(queryResults);
        }
      });
    });
  }
}
