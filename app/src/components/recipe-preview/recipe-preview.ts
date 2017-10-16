import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Haptic} from "ionic-angular";
import {RecipeEntity} from "../../entities/recipe-entity";
import {DomSanitizer} from "@angular/platform-browser";
import {DeviceFeedback} from "@ionic-native/device-feedback";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Neo4JService} from "../../services/neo4j.service";

@Component({
    selector: "recipe-preview",
    templateUrl: "recipe-preview.html"
})
export class RecipePreviewComponent {
    @Input() entity: RecipeEntity;
    @Output() onDeleted: EventEmitter<RecipeEntity> = new EventEmitter();
    @Output() onFavToggle: EventEmitter<RecipeEntity> = new EventEmitter();
    @Output() onClick: EventEmitter<RecipeEntity> = new EventEmitter();

    public showDeleteOption: boolean;
    public loading: boolean;

    constructor(private sanitizer: DomSanitizer,
                private haptic: Haptic,
                private deviceFeedback: DeviceFeedback,
                private socialSharing: SocialSharing,
                private neo4jService: Neo4JService) {
        this.showDeleteOption = false;
        this.loading = false;
    }

    getBackground(image) {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }

    showDetailedRecipe() {
        this.onClick.emit(this.entity);
    }

    share(recipe: RecipeEntity) {
        this.socialSharing
            .share(recipe.toString(), "Recipe: " + recipe.name)
            .then(() => {
                console.info("successfully shared");
            })
            .catch(() => {
                console.error("cannot share this recipe, i keep it a secret");
            });
    }

    toggleFavourite() {
        this.onFavToggle.emit(this.entity);
        this.loading = true;
        this.neo4jService.setFavourite(this.entity.id, !this.entity.favourite).then(v => {
            this.entity.favourite = v;
            this.loading = false;
        }).catch(err => {
            this.loading = false;
        });
    }

    displayDeleteOption() {
        this.haptic.selection(); //iOs
        this.deviceFeedback.haptic(1); // Android
        this.showDeleteOption = true;
    }

    delete() {
        this.showDeleteOption = false;
        this.onDeleted.emit(this.entity);
    }

    cancel() {
        this.showDeleteOption = false;
    }
}
