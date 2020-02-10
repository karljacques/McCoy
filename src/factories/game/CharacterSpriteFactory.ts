import {sharedProvide} from "../../util/SharedProvide";
import {inject} from "inversify";
import {RenderApplication} from "../../services/render/RenderApplication";
import AnimatedSprite = PIXI.AnimatedSprite;

@sharedProvide(CharacterSpriteFactory)
export class CharacterSpriteFactory {
    @inject(RenderApplication) renderApplication: RenderApplication;

    public getCharacterAnimation(character: string, animation: string): AnimatedSprite {
        const spriteSheet = this.renderApplication.getLoader().resources[character].spritesheet;
        const sprite = new AnimatedSprite(spriteSheet.animations[animation]);

        sprite.anchor.set(0.5, 0.5);

        sprite.zIndex = 10000;
        sprite.animationSpeed = 0.25;
        sprite.play();

        return sprite;

    }
}