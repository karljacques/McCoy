import {inject, injectable} from "inversify";
import {RenderApplication} from "../../services/render/RenderApplication";
import Sprite = PIXI.Sprite;
import Loader = PIXI.Loader;
import {sharedProvide} from "../../util/SharedProvide";

@sharedProvide(SpriteSheetFactory)
export class SpriteSheetFactory {
    protected loader: Loader;

    constructor(
        @inject(RenderApplication) renderApplication: RenderApplication
    ) {
        this.loader = renderApplication.getLoader();
    }

    public createSprite(spritesheetName: string, textureName: string): Sprite {
        const resources = this.loader.resources;
        const spritesheet = resources[spritesheetName].spritesheet;

        spritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        return new Sprite(spritesheet.textures[textureName]);
    }
}