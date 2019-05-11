import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {AuthInfo} from './auth-info';
import {ConnectionService} from './connection.service';
import {ErrorType, InternalError} from './internal-error';


@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient,
              private connectionService: ConnectionService) {
  }

  public save(fileUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.connectionService.withCredentials().then((val: AuthInfo) => {
            window.resolveLocalFileSystemURL(fileUri, (fileEntry: Entry) => {
this.http.post(val.serverUrl + '/images/upload', null,
{headers: {
    authorization:
    'Basic ' + window.btoa(val.username + ':' + val.password)
}});
            });
            /* window.resolveLocalFileSystemURL(fileUri, (fileEntry: Entry) => {
                this.fileTransfer
                    .upload(
                        fileEntry.toInternalURL(),
                        val.serverUrl + '/images/upload',
                        {
                            headers: {
                                authorization:
                                'Basic ' + window.btoa(val.username + ':' + val.password)
                            },
                            chunkedMode: true,
                            fileKey: 'recipe_img'
                        },
                        true
                    )
                    .then(res => {
                        const imgUrl =
                            val.serverUrl +
                            '/images/get/' +
                            JSON.parse(res.response).filename;
                        resolve(imgUrl);
                    })
                    .catch(err => {
                        const error: InternalError = new InternalError('cannot upload image to server.', ErrorType.IMG_UPLOAD_ERROR);
                        error.name = 'IMG_UPLOAD_ERROR';
                        reject(error);
                    });
            }, (error: FileError) => {

            }); */
        }).catch(err => {
            const error: InternalError = new InternalError('cannot connect to server.', ErrorType.CONN_ERROR);
            error.name = 'CONN_ERROR';
            reject(error);
        });
    });
}

public upload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        this.connectionService.withCredentials().then((val: AuthInfo) => {
            const formData: FormData = new FormData();
            formData.append('recipe_img', file, file.name);
            const headers = {
                authorization:
                'Basic ' + window.btoa(val.username + ':' + val.password)
            };
            const options = {headers};
            this.http
                .post(val.serverUrl + '/images/upload', formData, options)
                .pipe(map((res: HttpResponse<any>) => res))
                .pipe(catchError(error => throwError(error)))
                .subscribe(
                    (data: any) => {
                        const imgUrl = val.serverUrl + '/images/get/' + data.filename;
                        resolve(imgUrl);
                    },
                  (error: any) => reject(error)
                );
        });
    });
}
}
