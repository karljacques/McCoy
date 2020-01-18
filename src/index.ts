import "reflect-metadata";
import {Engine} from "@nova-engine/ecs";
import {SideScrollingCameraRenderingSystem} from "./system/render/SideScrollingCameraRenderingSystem";
import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";
import {RenderApplication} from "./services/RenderApplication";
import {Container as PIXIContainer} from 'pixi.js';
import './styles/main.css';
import {SideScrollingBackgroundLayerFactory} from "./factories/render/SideScrollingBackgroundLayerFactory";
import {BackgroundLayerComponent} from "./components/rendering/BackgroundLayerComponent";
import {WallEntityGenerationSystem} from "./system/entity/WallEntityGenerationSystem";

// Remove the check for WebGL support, my Mac doesn't support stencilling
// which we don't need anyway
// @ts-ignore
PIXI.Renderer.create = function create(options) {
    return new PIXI.Renderer(options);
};

const container = new Container();

container.load(buildProviderModule());

// https://nova-engine.github.io/ecs/
// This is the game engine - a collection of Systems.
// Systems operate on Components, an Entity consists of Components.
const engine = new Engine();

// Instantiate our rendering system, which uses PixiJS and register it with the engine
// The engine will call the update() method of the system every game loop
// It also calls the onAttach hook
const renderingSystem = container.get(SideScrollingCameraRenderingSystem);

engine.addSystem(renderingSystem);

const renderApplication = container.get(RenderApplication);
const loader = renderApplication.getLoader();

loader.add('bgFar', 'assets/bg-far.png');
loader.add('bgMid', 'assets/bg-mid.png');

loader.add('wall', 'assets/wall.json');

loader.load((loader, resources) => {
    const stage = new PIXIContainer();
    resources.bgMid.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const backgroundFactory = container.get(SideScrollingBackgroundLayerFactory);
    const bgFar = backgroundFactory.createBackdropLayer(resources.bgFar, 3);
    const bgMid = backgroundFactory.createBackdropLayer(
        resources.bgMid,
        2,
        PIXI.SCALE_MODES.NEAREST,
        128
    );


    stage.addChild(bgFar.getComponent(BackgroundLayerComponent).sprite);
    stage.addChild(bgMid.getComponent(BackgroundLayerComponent).sprite);

    engine.addEntity(bgMid);
    engine.addEntity(bgFar);

    renderApplication.getTicker().add(() => {
        const elapsedMs = renderApplication.getTicker().elapsedMS;
        engine.update(elapsedMs);
    });

    renderApplication.getStage().addChild(stage);

    const wallEntityGenerationSystem = container.get(WallEntityGenerationSystem);

    engine.addSystem(wallEntityGenerationSystem);
});