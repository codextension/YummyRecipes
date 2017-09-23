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
import "rxjs/add/operator/timeout";
import { AuthInfo } from "./auth-info";

import {
  SecureStorage,
  SecureStorageObject
} from "@ionic-native/secure-storage";

@Injectable()
export class Neo4JService {
  constructor(private http: Http, private secureStorage: SecureStorage) {}

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
          resolve(new AuthInfo("elie", "pwd", "https://localhost:3443"));
          console.error("Cannot load the secure storage engine");
        });
    });
  }

  private query(q: string[], authInfo?: AuthInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      if (authInfo != null) {
        this.postData(authInfo, q)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        this.withCredentials()
          .then((val: AuthInfo) => {
            this.postData(val, q)
              .then(data => {
                resolve(data);
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
    });
  }

  private postData(val: AuthInfo, q: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let _headers = new Headers({
        "Content-Type": "application/json",
        authorization: "Basic " + window.btoa(val.username + ":" + val.password)
      });
      let options = new RequestOptions({
        headers: _headers
      });
      this.http
        .post(val.serverUrl + "/db/query", { query: q }, options)
        .timeout(3000)
        .map(this.queryResuts)
        .catch((err: any) => {
          return Observable.of(undefined);
        })
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  private queryResuts(response: Response): string {
    return response.json();
  }

  public ping(authInfo: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.query(["match (n) return count(n)"], authInfo).then(queryResults => {
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
      this.query([query]).then(queryResults => {
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
      this.query([query]).then(queryResults => {
        if (queryResults == undefined) {
          reject(false);
        } else {
          resolve(Boolean(queryResults[0].records[0]._fields[0]));
        }
      });
    });
  }

  public deleteRecipe(entity: RecipeEntity): Promise<boolean> {
    let query: string[] = [
      `match(r:Recipe {id:"${entity.id}"})-[c:CONTAINS]->(:Ingredient) delete r, c`
    ];

    return new Promise((resolve, reject) => {
      this.query(query).then(queryResults => {
        if (queryResults == undefined) {
          reject("something is wrong with your query.");
        } else {
          resolve(true);
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
        ingredient.quantity == null ||
        ingredient.quantity.toString().trim().length == 0
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
      this.query(query).then(queryResults => {
        if (queryResults == undefined) {
          reject(null);
        } else {
          resolve(queryResults[0].records[0]._fields[0]);
        }
      });
    });
  }

  public findRecipes(page: number, text?): Promise<RecipeEntity[]> {
    let query: string = `match(r:Recipe)-[c:CONTAINS]->(i:Ingredient) return r,c,i order by ID(r) skip ${page *
      5} limit 5`;
    if (text != null) {
      if (typeof text === "string") {
        query = `match(r:Recipe)-[c:CONTAINS]->(i:Ingredient) where lower(r.name) contains('${text.toLowerCase()}') or lower(r.description) contains('${text.toLowerCase()}')  return r,c,i order by ID(r) skip ${page *
          5} limit 5`;
      } else if (typeof text === "boolean" && text == true) {
        query = `match(r:Recipe {favourite:${text}})-[c:CONTAINS]->(i:Ingredient) return r,c,i order by ID(r) skip ${page *
          5} limit 5`;
      }
    }
    return new Promise((resolve, reject) => {
      this.query([query]).then(queryResults => {
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
                  return re.id == array[index].id;
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
