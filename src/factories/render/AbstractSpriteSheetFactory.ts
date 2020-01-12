import {inject, injectable} from "inversify";
import {RenderApplication} from "../../services/RenderApplication";
import Sprite = PIXI.Sprite;
import Loader = PIXI.Loader;

@injectable()
export abstract class AbstractSpriteSheetFactory {
    protected loader: Loader;

    constructor(
        @inject(RenderApplication) renderApplication: RenderApplication
    ) {
        this.loader = renderApplication.getLoader();

        this.loader.resources[this.getSpriteSheetName()].spritesheet.baseTexture.scaleMode =
            PIXI.SCALE_MODES.NEAREST;
    }

    abstract getSpriteSheetName(): string;

    public createSprite(textureName: string): Sprite {
        const resources = this.loader.resources;
        return new Sprite(resources[this.getSpriteSheetName()].spritesheet.textures[textureName]);
    }
}