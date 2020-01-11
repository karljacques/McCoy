import {Engine, System} from "@nova-engine/ecs";
import {RenderApplication} from "../../services/RenderApplication";
import {decorate, inject, injectable} from "inversify";
import {provide} from "inversify-binding-decorators";

// Eurgh, why does the parent have to be injectable?
decorate(injectable(), System);

// @provide makes this class injectable, but also binds this class to the given identifier
// https://github.com/inversify/inversify-binding-decorators/
@provide(RenderingSystem)
export class RenderingSystem extends System {

    @inject(RenderApplication) protected renderApplication: RenderApplication;

    constructor() {
        super();
        console.log('RENDERING_SYSTEM_INITIALISED');
        console.log(this.renderApplication);
        // this.application.loader.add('cat', 'assets/cat.png')
        //     .load(((loader, resources) => {
        //         const sprite = new Sprite(resources.cat.texture);
        //         sprite.visible = true;
        //         // Setup the position of the cat
        //         sprite.x = this.application.renderer.width / 2;
        //         sprite.y = this.application.renderer.height / 2;
        //
        //         // Rotate around the center
        //         sprite.anchor.x = 0.5;
        //         sprite.anchor.y = 0.5;
        //
        //         // Add the cat to the scene we are building
        //         this.application.stage.addChild(sprite);
        //
        //         // Listen for frame updates
        //         this.application.ticker.add(() => {
        //             // each frame we spin the sprite around a bit
        //             sprite.rotation += 0.01;
        //         });
        //     }));
    }

    update(engine: Engine, delta: number): void {

    }
}