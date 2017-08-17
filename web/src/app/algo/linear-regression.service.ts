import { Injectable } from "@angular/core";
import { Data } from "../io/data";
import { Feature } from "../io/feature";
import { Result } from "../io/result";
import { XYPair } from "../io/xypair";
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
export class LinearRegressionService {
  constructor(private http: Http, private window: Window) {}
}
