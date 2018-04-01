import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the TranslatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    private translation: string = null;
    private localisationMap: Map<string, any>;

    constructor(private http: HttpClient) {
        this.localisationMap = new Map<string, any>();
    };

    transform(value: string, ...args) {
        let lang: string = navigator.language;
        if (!this.localisationMap.has(lang)) {
            this.getJSON(lang).subscribe(localisations => {
                    this.localisationMap.set(lang, localisations.value);
                    this.translation = this.localisationMap.get(lang)[value];
                }
                , error => {
                    if (!this.localisationMap.has('en-US')) {
                        this.getJSON('en-US').subscribe(localisations => {
                            this.localisationMap.set(lang, localisations.value);
                            this.translation = this.localisationMap.get(lang)[value];
                        }, error2 => {
                            console.error(error2);
                        });
                    }
                }
            )
        } else {
            this.translation = this.localisationMap.get(lang)[value];
        }
        return this.translation;
    }

    private getJSON(lang: string): Observable<any> {
        return this.http.get(`./assets/i18n/${lang}.json`)
            .map((res: any) => Observable.of(res))
            .catch((err: any) => Observable.of(err))
    }
}
