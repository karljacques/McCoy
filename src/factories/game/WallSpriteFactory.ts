import {provide} from "inversify-binding-decorators";
import {AbstractSpriteSheetFactory} from "../render/AbstractSpriteSheetFactory";

@provide(WallSpriteFactory)
export class WallSpriteFactory extends AbstractSpriteSheetFactory {
    getSpriteSheetName(): string {
        return "wall";
    }
}