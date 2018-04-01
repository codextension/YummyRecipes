import {NgModule} from "@angular/core";
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {IonicModule} from "ionic-angular";
import {ConnectionService} from "./connection.service";
import {Neo4JService} from "./neo4j.service";
import {ImagesService} from "./images.service";
import {SecureStorage} from "@ionic-native/secure-storage";
import {LocalisationService} from "./localisation.service";

@NgModule({
    declarations: [],
    imports: [IonicModule, HttpClientModule, HttpClientJsonpModule],
    exports: [],
    providers: [ConnectionService, Neo4JService, ImagesService, LocalisationService, SecureStorage]
})
export class ServicesModule {
}
