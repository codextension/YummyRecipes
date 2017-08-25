import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class Neo4JService {
  private restEntryPointUrl: string;

  constructor(private http: Http) {
    this.restEntryPointUrl = "https://localhost:3443/db/query";
  }

  private query(q: string): Observable<string> {
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: "Basic " + window.btoa("elie:pwd")
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
