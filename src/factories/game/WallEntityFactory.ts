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

    public createWall(): Entity {
        const entity = new Entity();

        entity.putComponent(WorldPositionComponent);
        const tileMapComponent = entity.putComponent(TileMapComponent);
        const wallLength = Math.random() * 7;
        
        this.addSpriteToWall(tileMapComponent, 'FRONT_EDGE');
        this.addSpriteToWall(tileMapComponent, 'WINDOW');

        const centralWindowIndex = wallLength % 2 === 0 ? null : (wallLength) / 2;

        for (let i = 0; i < wallLength; i++) {
            const type = (i === centralWindowIndex) ? 'WINDOW' : 'DECORATION';

            this.addSpriteToWall(tileMapComponent, type);
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

    protected addSpriteToWall(tileMapComponent: TileMapComponent, type: string) {
        const sprite = this.wallSegmentPool.getSprite(type);
        tileMapComponent.addSprite(sprite, this.currentWidth, 0);
        this.currentWidth += sprite.sprite.texture.width;

    }
}