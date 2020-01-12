import {provide} from "inversify-binding-decorators";
import {Entity} from "@nova-engine/ecs";
import {BackgroundLayerComponent} from "../../components/rendering/BackgroundLayerComponent";
import TilingSprite = PIXI.TilingSprite;
import LoaderResource = PIXI.LoaderResource;
import SCALE_MODES = PIXI.SCALE_MODES;

@provide(SideScrollingBackgroundLayerFactory)
export class SideScrollingBackgroundLayerFactory {
    public createBackdropLayer(
        resource: LoaderResource,
        distance: number = 1,
        scaleMode: SCALE_MODES = PIXI.SCALE_MODES.LINEAR,
        heightOffset: number = 0
    ): Entity {
        const entity = new Entity();

        const backgroundLayerComponent = entity.putComponent(BackgroundLayerComponent);
        backgroundLayerComponent.sprite = new TilingSprite(resource.texture,
            resource.texture.width,
            resource.texture.height);

        resource.texture.baseTexture.scaleMode = scaleMode;

        backgroundLayerComponent.sprite.tilePosition.x = 0;
        backgroundLayerComponent.sprite.tilePosition.y = 0;

        backgroundLayerComponent.sprite.position.y = heightOffset;

        if (distance <= 0) {
            throw new Error('Distance must be greater than 0');
        }

        backgroundLayerComponent.distance = distance;

        return entity;
    }
}