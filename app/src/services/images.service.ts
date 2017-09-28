import {Headers, Http, RequestOptions} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {FileEntry} from "@ionic-native/file";
import {AuthInfo} from "./auth-info";
import {ConnectionService} from "./connection.service";

@Injectable()
export class ImagesService {
    private fileTransfer: FileTransferObject;

    constructor(private transfer: FileTransfer,
                private http: Http,
                private connectionService: ConnectionService) {
        this.fileTransfer = this.transfer.create();
    }

    public save(fileUri: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.connectionService.withCredentials().then((val: AuthInfo) => {
                window.resolveLocalFileSystemURL(fileUri, (fileEntry: FileEntry) => {
                    fileEntry.file(success => {
                        console.log(success.localURL);
                    });
                    this.fileTransfer
                        .upload(
                            fileEntry.toInternalURL(),
                            val.serverUrl + "/images/upload",
                            {
                                headers: {
                                    authorization:
                                    "Basic " + window.btoa(val.username + ":" + val.password)
                                },
                                chunkedMode: true,
                                fileKey: "recipe_img"
                            },
                            true
                        )
                        .then(res => {
                            console.info(res);
                            let imgUrl =
                                val.serverUrl +
                                "/images/get/" +
                                JSON.parse(res.response).filename;
                            resolve(imgUrl);
                        })
                        .catch(err => {
                            console.error(err);
                        });
                });
            });
        });
    }

    public upload(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            this.connectionService.withCredentials().then((val: AuthInfo) => {
                let formData: FormData = new FormData();
                formData.append("recipe_img", file, file.name);
                let headers = new Headers();
                headers.append(
                    "authorization",
                    "Basic " + window.btoa(val.username + ":" + val.password)
                );
                let options = new RequestOptions({headers: headers});
                this.http
                    .post(val.serverUrl + "/images/upload", formData, options)
                    .map(res => res.json())
                    .catch(error => Observable.throw(error))
                    .subscribe(
                        data => {
                            let imgUrl = val.serverUrl + "/images/get/" + data.filename;
                            resolve(imgUrl);
                        },
                        error => reject(error)
                    );
            });
        });
    }
}
