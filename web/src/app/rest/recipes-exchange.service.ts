import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  RequestOptionsArgs,
  URLSearchParams
} from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class RecipesExchangeService {

  constructor(private http:Http, private window:Window) {
  }

}
