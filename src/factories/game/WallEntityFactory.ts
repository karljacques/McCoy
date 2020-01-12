import {provide} from "inversify-binding-decorators";
import {inject} from "inversify";
import {WallSegmentPool} from "../../pools/WallSegmentPool";
import {Entity} from "@nova-engine/ecs";
import {TileMapComponent} from "../../components/rendering/TileMapComponent";

@provide(WallEntityFactory)
export class WallEntityFactory {
    @inject(WallSegmentPool) protected wallSegmentPool: WallSegmentPool;

    public createWall(): Entity {
        const entity = new Entity();

        const tileMapComponent = entity.putComponent(TileMapComponent);
        const wallLength = Math.random() * 5;

        let currentWidth = 0;

        for (let i = 0; i < wallLength; i++) {
            const sprite = this.wallSegmentPool.getWindow();

            tileMapComponent.addSprite(sprite, currentWidth, 0, 'WALL');
            currentWidth += sprite.texture.width;
        }

        return entity;
    }
}