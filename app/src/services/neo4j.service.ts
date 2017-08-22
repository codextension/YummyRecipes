import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { DaoService } from "./dao.service";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class Neo4JService implements DaoService {
  private restEntryPointUrl: string;

  constructor(private http: Http) {
    this.restEntryPointUrl = "http://localhost:7474/db/data";
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
        this.restEntryPointUrl + "/cypher",
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

  private createTransaction(): Observable<string> {
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: "Basic " + window.btoa("elie:pwd")
    });
    let options = new RequestOptions({
      headers: _headers
    });
    let results = this.http
      .post(this.restEntryPointUrl + "/transaction", null, options)
      .map(this.queryTxNb)
      .catch((err: any) => {
        return Observable.of(undefined);
      });

    return results;
  }

  private commitTransaction(txUrl: string): Observable<boolean> {
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: "Basic " + window.btoa("elie:pwd")
    });
    let options = new RequestOptions({
      headers: _headers
    });
    let results = this.http
      .post(txUrl, null, options)
      .map(this.queryTxCommitInfo)
      .catch((err: any) => {
        return Observable.of(false);
      });

    return results;
  }

  private rollbackTransaction(txUrl: string): Observable<boolean> {
    let _headers = new Headers({
      "Content-Type": "application/json",
      authorization: "Basic " + window.btoa("elie:pwd")
    });
    let options = new RequestOptions({
      headers: _headers
    });
    let results = this.http
      .delete(txUrl.replace("commit", ""), options)
      .map(this.queryTxCommitInfo)
      .catch((err: any) => {
        return Observable.of(false);
      });

    return results;
  }

  private queryTxCommitInfo(response: Response): boolean {
    return response.json().errors.length == 0;
  }

  private queryTxNb(response: Response): string {
    return response.json().commit;
  }
  private queryResuts(response: Response): string {
    return response.json();
  }

  public execute(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.createTransaction().subscribe(tx => {
        if (tx == undefined) {
          reject("cannot create a transaction.");
        } else {
          this.query(query).subscribe(queryResults => {
            if (queryResults == undefined) {
              this.rollbackTransaction(tx).subscribe(result => {
                if (!result) {
                  reject("Cannot rollback the transaction [" + tx + "]");
                } else {
                  reject(
                    "something is wrong with your query, transaction rolledback"
                  );
                }
              });
            } else {
              this.commitTransaction(tx).subscribe(result => {
                if (!result) {
                  reject("Cannot close the transaction [" + tx + "]");
                } else {
                  resolve(queryResults);
                }
              });
            }
          });
        }
      });
    });
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
