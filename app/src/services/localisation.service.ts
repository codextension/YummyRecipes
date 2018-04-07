import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class LocalisationService {
    private localisationMap: Map<string, any>;

    constructor(private http: HttpClient) {
        this.localisationMap = new Map<string, any>();
    };

    public get(value: string): Promise<string> {
        let lang: string = navigator.language;

        return new Promise<string>((accept, reject) => {
            if (!this.localisationMap.has(lang)) {
                this.getJSON(lang).toPromise().then(localisations => {
                        this.localisationMap.set(lang, localisations.value);
                        accept(localisations.value[value]);
                    }
                    , error => {
                        this.getJSON('en-US').toPromise().then(localisations => {
                            accept(localisations.value[value]);
                        }, error2 => {
                            reject(value);
                            console.error(error2);
                        });
                    }
                )
            } else {
                accept(this.localisationMap.get(lang)[value]);
            }
        });
    }

    private getJSON(lang: string): Observable<any> {
        return this.http.get(`./assets/i18n/${lang}.json`)
            .map((res: any) => Observable.of(res))
            .catch((err: any) => Observable.of(err))
    }
}