import {sharedProvide} from "../../util/SharedProvide";
import {Engine, Entity, Family, FamilyBuilder, System} from "@nova-engine/ecs";
import {CharacterAnimationComponent} from "../../components/CharacterAnimationComponent";
import {RenderableComponent} from "../../components/rendering/RenderableComponent";
import {inject} from "inversify";
import {RenderApplication} from "../../services/render/RenderApplication";
import {CharacterSpriteFactory} from "../../factories/game/CharacterSpriteFactory";

@sharedProvide(CharacterAnimationSystem)
export class CharacterAnimationSystem extends System {
    @inject(RenderApplication) renderApplication: RenderApplication;
    @inject(CharacterSpriteFactory) spriteFactory: CharacterSpriteFactory;
    protected family: Family;

    public priority = 1;

    onAttach(engine: Engine): void {
        this.family = new FamilyBuilder(engine).include(CharacterAnimationComponent).build();
    }

    update(engine: Engine, delta: number): void {
        this.family.entities.forEach((entity: Entity) => {
            const characterAnimationComponent = entity.getComponent(CharacterAnimationComponent);

            if (characterAnimationComponent.stateChanged) {
                console.log('STATE_CHANGED');
                const simpleRenderableComponent = entity.getComponent(RenderableComponent);

                let state = characterAnimationComponent.running ? 'run' : 'idle';
                if (characterAnimationComponent.jumping) {
                    state = 'jump';
                }
                console.log(state);

                const oldSprite = simpleRenderableComponent.sprite;

                oldSprite.destroy();
                simpleRenderableComponent.sprite = this.spriteFactory.getCharacterAnimation('bunny', state);
                simpleRenderableComponent.sprite.scale.x = -characterAnimationComponent.directionX;
                this.renderApplication.getStage().addChild(simpleRenderableComponent.sprite);

                characterAnimationComponent.reset();
            }
        });
    }

}