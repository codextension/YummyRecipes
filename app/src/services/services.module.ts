import {NgModule} from "@angular/core";
import {HttpModule, JsonpModule} from "@angular/http";
import {IonicModule} from "ionic-angular";
import {ConnectionService} from "./connection.service";
import {Neo4JService} from "./neo4j.service";
import {ImagesService} from "./images.service";
import {SecureStorage} from "@ionic-native/secure-storage";

@NgModule({
    declarations: [],
    imports: [IonicModule, HttpModule, JsonpModule],
    exports: [],
    providers: [ConnectionService, Neo4JService, ImagesService, SecureStorage]
})
export class ServicesModule {
}
