import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Ingredient, RecipeEntity} from "../entities/recipe-entity";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";
import {AuthInfo} from "./auth-info";
import {ConnectionService} from "./connection.service";
import {ErrorType, InternalError} from "./internal-error";

@Injectable()
export class Neo4JService {
    constructor(private http: Http,
                private connectionService: ConnectionService) {
    }

    private static sanitize(entity: RecipeEntity): RecipeEntity {
        entity.name = entity.name.replace(/"/g, '').replace(/\\/g, "");
        entity.notes = entity.notes != null ? entity.notes.replace(/"/g, '').replace(/\\/g, "") : null;

        for (let i = 0; i < entity.ingredients.length; i++) {
            entity.ingredients[i].name = entity.ingredients[i].name != null ? entity.ingredients[i].name
                .replace(/"/g, '')
                .replace(/\\/g, "") : null;
            entity.ingredients[i].unit = entity.ingredients[i].unit != null ? entity.ingredients[i].unit
                .replace(/"/g, '')
                .replace(/\\/g, "") : null;
        }

        for (let i = 0; i < entity.instructions.length; i++) {
            entity.instructions[i] = entity.instructions[i]
                .replace(/"/g, '')
                .replace(/\\/g, "");
        }

        return entity;
    }

    public ping(authInfo: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.query(["match (n) return count(n)"], authInfo).then(queryResults => {
                if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                    let error: InternalError = new InternalError("cannot connect to server.", ErrorType.CONN_ERROR);
                    error.name = "CONN_ERROR";
                    reject(error);
                } else {
                    resolve("pong");
                }
            });
        });
    }

    public select(query: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.query([query]).then(queryResults => {
                if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                    let error: InternalError = new InternalError(`something is wrong with your query <${query}>`, ErrorType.QUERY_ERROR);
                    error.name = "QUERY_ERROR";
                    reject(error);
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
                if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                    let error: InternalError = new InternalError(`something is wrong with your query <${query}>`, ErrorType.QUERY_ERROR);
                    error.name = "QUERY_ERROR";
                    reject(error);
                } else {
                    try {
                        resolve(Boolean(queryResults[0].records[0]._fields[0]));
                    } catch (e) {
                        reject(e);
                    }
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
                    let error: InternalError = new InternalError(`something is wrong with your query <${query}>`, ErrorType.QUERY_ERROR);
                    error.name = "QUERY_ERROR";
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public saveRecipe(entity: RecipeEntity): Promise<string> {
        entity = Neo4JService.sanitize(entity);

        let instructions: string =
            entity.instructions.length > 0
                ? 'r.instructions=["' + entity.instructions.join('","') + '"]'
                : "r.instructions=[]";
        let query: string[] = [
            `merge(r:Recipe {id:"${entity.id}"}) ON CREATE SET r.id="${entity.id}", r.name="${entity.name}", r.imageUrl="${entity.imageUrl}", r.favourite=${entity.favourite}, r.notes="${entity.notes ||
            ""}", r.duration=${entity.duration}, r.servings=${entity.servings}, ${instructions} ON MATCH SET r.favourite=${entity.favourite}, r.servings=${entity.servings}, r.duration=${entity.duration}, r.notes="${entity.notes ||
            ""}", r.imageUrl="${entity.imageUrl}", ${instructions}, r.name="${entity.name}" return r.id`
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
            let notes = ingredient.notes == null ? "" : `, notes:"${ingredient.notes}"`;
            query.push(
                `merge(i:Ingredient {id:"${ingredient.id}"}) ON CREATE SET i.id="${ingredient.id}", i.name="${ingredient.name}" ON MATCH SET i.name="${ingredient.name}" return i.id`
            );
            query.push(
                `match (r:Recipe {id:"${entity.id}"}) match(i:Ingredient {id:"${ingredient.id}"}) create (r)-[:CONTAINS {${qty} unit:"${unit}" ${notes}}]->(i)`
            );
        }

        return new Promise((resolve, reject) => {
            this.query(query).then(queryResults => {
                if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                    let error: InternalError = new InternalError(`something is wrong with your query <${query}>`, ErrorType.QUERY_ERROR);
                    error.name = "QUERY_ERROR";
                    reject(error);
                } else {
                    resolve(queryResults[0].records[0]._fields[0]);
                }
            });
        });
    }

    public findIngredients(text: string): Promise<Ingredient[]> {
        let query: string = `match (i:Ingredient) where lower(i.name) starts with "${text}" return i`;

        return new Promise((resolve, reject) => {
            this.query([query]).then(queryResults => {
                if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                    let error: InternalError = new InternalError("cannot connect to server.", ErrorType.CONN_ERROR);
                    error.name = "CONN_ERROR";
                    reject(error);
                } else {
                    let output: Ingredient[] = [];
                    for (let res of queryResults[0].records) {
                        try {
                            let ingredient: Ingredient = new Ingredient(res._fields[0].properties.id, res._fields[0].properties.name, res._fields[0].properties.quantity || null, res._fields[0].properties.unit || null, res._fields[0].properties.notes || null);
                            output.push(ingredient);
                        } catch (ex) {
                            console.warn("wrong ingredient?");
                        }
                        resolve(output);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    public findRecipes(page: number, size: number = 5, text?): Promise<RecipeEntity[]> {
        let query: string = `match(r:Recipe) return r order by ID(r) skip ${page *
        size} limit ${size}`;
        if (text != null) {
            if (typeof text === "string") {
                query = `match(r:Recipe) where lower(r.name) contains('${text.toLowerCase()}') or lower(r.description) contains('${text.toLowerCase()}')  return r order by ID(r) skip ${page *
                size} limit ${size}`;
            } else if (typeof text === "boolean" && text == true) {
                query = `match(r:Recipe {favourite:${text}}) return r order by ID(r) skip ${page *
                size} limit ${size}`;
            }
        }

        return new Promise((resolve, reject) => {
            this.query([query])
                .then(queryResults => {
                    if (queryResults == undefined || (queryResults.ok != null && !queryResults.ok)) {
                        let error: InternalError = new InternalError("cannot connect to server.", ErrorType.CONN_ERROR);
                        error.name = "CONN_ERROR";
                        reject(error);
                    } else {
                        let output: RecipeEntity[] = [];
                        if (queryResults != null && queryResults.length > 0) {
                            for (let res of queryResults[0].records) {
                                try {
                                    let re: RecipeEntity = new RecipeEntity(
                                        res._fields[0].properties.id,
                                        res._fields[0].properties.name,
                                        res._fields[0].properties.duration.low,
                                        res._fields[0].properties.notes,
                                        res._fields[0].properties.favourite,
                                        [],
                                        res._fields[0].properties.instructions,
                                        [],
                                        res._fields[0].properties.imageUrl,
                                        res._fields[0].properties.servings.low
                                    );
                                    output.push(re);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        }

                        let ingredientQuery: string[] = [];
                        for (let out of output) {
                            ingredientQuery.push(
                                `match(r:Recipe{id:"${out.id}"})-[c:CONTAINS]->(i:Ingredient) return r.id, c, i`
                            );
                        }

                        this.query(ingredientQuery)
                            .then(results => {
                                for (let i = 0; i < results.length; i++) {
                                    for (let res of results[i].records) {
                                        let ing: Ingredient = new Ingredient(
                                            res._fields[2].properties.id,
                                            res._fields[2].properties.name,
                                            res._fields[1].properties.quantity == null
                                                ? ""
                                                : res._fields[1].properties.quantity.low,
                                            res._fields[1].properties.unit,
                                            res._fields[1].properties.notes
                                        );
                                        output[i].ingredients.push(ing);
                                    }
                                }
                                resolve(output);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                })
                .catch(err => {
                    reject(err);
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
                this.connectionService.withCredentials()
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
                .post(val.serverUrl + "/db/query", {query: q}, options)
                .timeout(5000)
                .map(this.queryResuts)
                .catch((err: any) => {
                    return Observable.of(err);
                })
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    private queryResuts(response: Response): string {
        return response.json();
    }
}
