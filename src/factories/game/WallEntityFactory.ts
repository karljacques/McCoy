import {provide} from "inversify-binding-decorators";
import {inject} from "inversify";
import {WallSegmentPool} from "../../pools/WallSegmentPool";
import {Entity} from "@nova-engine/ecs";
import {TileMapComponent} from "../../components/rendering/TileMapComponent";
import {WorldPositionComponent} from "../../components/WorldPositionComponent";
import {TypedSprite} from "../../types/TypedSprite";

@provide(WallEntityFactory)
export class WallEntityFactory {
    @inject(WallSegmentPool) protected wallSegmentPool: WallSegmentPool;

    private currentWidth: number = 0;
    private currentLevel: number = 0;

    public createWall(): Entity {
        const entity = new Entity();
        this.currentWidth = 0;

        entity.putComponent(WorldPositionComponent);
        const tileMapComponent = entity.putComponent(TileMapComponent);
        const wallLength = Math.random() * 7;
        
        this.addSpriteToWall(tileMapComponent, 'FRONT_EDGE');
        this.addSpriteToWall(tileMapComponent, 'WINDOW');

        const centralWindowIndex = wallLength % 2 === 0 ? null : (wallLength) / 2;

        for (let i = 0; i < wallLength; i++) {
            const type = (i === centralWindowIndex) ? 'WINDOW' : 'DECORATION';

            if (this.shouldChangeLevel()) {
                if (this.currentLevel === 0) {
                    this.currentLevel = 1;
                    this.addSpriteToWall(tileMapComponent, 'STEP_UP');
                } else {
                    this.addSpriteToWall(tileMapComponent, 'STEP_DOWN');
                    this.currentLevel = 0;
                }
            } else {
                this.addSpriteToWall(tileMapComponent, type);
            }
        }
        this.addSpriteToWall(tileMapComponent, 'WINDOW');
        this.addSpriteToWall(tileMapComponent, 'BACK_EDGE');

        return entity;
    }

    public deconstructWall(tileMapComponent: TileMapComponent) {
        tileMapComponent.sprites.forEach((sprite: TypedSprite) => {
            this.wallSegmentPool.giveBackSprite(sprite);
        });
    }

    protected shouldChangeLevel(): boolean {
        return (Math.random() * 5) < 1;
    }

    protected addSpriteToWall(tileMapComponent: TileMapComponent, type: string) {
        const sprite = this.wallSegmentPool.getSprite(type);
        sprite.sprite.visible = true;

        tileMapComponent.addSprite(sprite, this.currentWidth, 196 - (this.currentLevel * 64));
        this.currentWidth += sprite.sprite.texture.width;
    }

}