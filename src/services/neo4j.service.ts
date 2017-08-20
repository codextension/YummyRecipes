import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class Neo4JService {
  private restEntryPointUrl: string;

  constructor(private http: Http) {
    this.restEntryPointUrl = "http://localhost:7474/db/data/cypher";
  }

  public query(q: string): Observable<string> {
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
        console.error("Something is wrong..");
        return Observable.of(undefined);
      });

    return results;
  }

  private createTransaction(): number {
    return null;
  }

  private queryResuts(response: Response): any {
    return response.json();
  }
}
