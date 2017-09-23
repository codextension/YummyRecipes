import {
  Http,
  Response,
  RequestOptions,
  Headers,
  URLSearchParams
} from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { Ingredient, RecipeEntity } from "../entities/recipe-entity";
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
        this.authInfo = [];
        this.authInfo.serverUrl = "https://localhost:3443";
        this.authInfo.username = "elie";
        this.authInfo.password = "pwd";
        console.error("Cannot load the secure storage engine");
      });
  }

  private query(q: string[], val: any): Observable<any> {
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
      .post(val.serverUrl + "/db/query", { query: q }, options)
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
        ["match (n) return count(n)"],
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
      this.query([query], null).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject("something is wrong with your query.");
        } else {
          resolve(queryResults);
        }
      });
    });
  }

  public setFavourite(id: string, value: boolean): Promise<boolean> {
    let query: string = `MERGE (r:Recipe {id:"${id}"}) set r.favourite=${value} return r.favourite`;

    return new Promise((resolve, reject) => {
      this.query([query], null).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject(false);
        } else {
          resolve(Boolean(queryResults[0].records[0]._fields[0]));
        }
      });
    });
  }

  public saveRecipe(entity: RecipeEntity): Promise<string> {
    let query: string[] = [
      `merge(r:Recipe {id:"${entity.id}"}) ON CREATE SET r.id="${entity.id}", r.name="${entity.name}", r.imageUrl="${entity.imageUrl}", r.favourite=${entity.favourite}, r.description="${entity.description ||
        ""}", r.duration=${entity.duration}, r.servings=${entity.servings}, r.instructions=["${entity.instructions.join(
        '","'
      )}"] ON MATCH SET r.favourite=${entity.favourite}, r.servings=${entity.servings}, r.duration=${entity.duration}, r.imageUrl="${entity.imageUrl}", r.instructions=["${entity.instructions.join(
        '","'
      )}"], r.name="${entity.name}" return r.id`
    ];

    query.push(
      `match (:Recipe {id:"${entity.id}"})-[c:CONTAINS]->(:Ingredient) delete c`
    );

    for (let ingredient of entity.ingredients) {
      let qty =
        ingredient.quantity == null
          ? ""
          : "quantity:" + ingredient.quantity + ", ";
      let unit = ingredient.unit == null ? "" : ingredient.unit;
      query.push(
        `merge(i:Ingredient {id:"${ingredient.id}"}) ON CREATE SET i.id="${ingredient.id}", i.name="${ingredient.name}" ON MATCH SET i.name="${ingredient.name}" return i.id`
      );
      query.push(
        `match (r:Recipe {id:"${entity.id}"}) match(i:Ingredient {id:"${ingredient.id}"}) create (r)-[:CONTAINS {${qty} unit:"${unit}"}]->(i)`
      );
    }

    return new Promise((resolve, reject) => {
      this.query(query, null).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject(null);
        } else {
          resolve(queryResults[0].records[0]._fields[0]);
        }
      });
    });
  }

  public findRecipes(page: number): Promise<RecipeEntity[]> {
    let query: string = `match(r:Recipe)-[c:CONTAINS]->(i:Ingredient) return r,c,i order by ID(r) skip ${page *
      5} limit 5`;
    return new Promise((resolve, reject) => {
      this.query([query], null).subscribe(queryResults => {
        if (queryResults == undefined) {
          reject(-1);
        } else {
          let output: RecipeEntity[] = [];
          if (queryResults != null && queryResults.length > 0) {
            for (let res of queryResults[0].records) {
              let ing: Ingredient = new Ingredient(
                res._fields[2].properties.id,
                res._fields[2].properties.name,
                res._fields[1].properties.quantity == null
                  ? ""
                  : res._fields[1].properties.quantity.low,
                res._fields[1].properties.unit
              );

              let re: RecipeEntity = new RecipeEntity(
                res._fields[0].properties.id,
                res._fields[0].properties.name,
                res._fields[0].properties.duration.low,
                res._fields[0].properties.description,
                res._fields[0].properties.favourite,
                [],
                res._fields[0].properties.instructions,
                [],
                res._fields[0].properties.imageUrl,
                res._fields[0].properties.servings.low
              );
              let index: number = output.findIndex(
                (value: RecipeEntity, index: number, array: RecipeEntity[]) => {
                  return value.id == array[index].id;
                },
                re
              );

              if (index > -1) {
                output[index].ingredients.push(ing);
              } else {
                re.ingredients.push(ing);
                output.push(re);
              }
            }
          }
          resolve(output);
        }
      });
    });
  }
}
