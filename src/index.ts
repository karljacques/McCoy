import "reflect-metadata";
import {Engine, Entity} from "@nova-engine/ecs";
import {SideScrollingCameraRenderingSystem} from "./system/render/SideScrollingCameraRenderingSystem";
import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";
import {RenderApplication} from "./services/render/RenderApplication";
import {Container as PIXIContainer} from 'pixi.js';
import './styles/main.css';
import {SideScrollingBackgroundLayerFactory} from "./factories/render/SideScrollingBackgroundLayerFactory";
import {BackgroundLayerComponent} from "./components/rendering/BackgroundLayerComponent";
import {WallEntityGenerationSystem} from "./system/entity/WallEntityGenerationSystem";
import {UserInputService} from "./services/input/UserInputService";
import {CameraControlSystem} from "./system/camera/CameraControlSystem";
import {SimpleRenderableComponent} from "./components/rendering/SimpleRenderableComponent";
import {WorldPositionComponent} from "./components/WorldPositionComponent";
import {ControllableComponent} from "./components/input/ControllableComponent";
import {ControllableHandlerSystem} from "./system/entity/ControllableHandlerSystem";
import {CharacterAnimationSystem} from "./system/entity/CharacterAnimationSystem";
import {CharacterAnimationComponent} from "./components/CharacterAnimationComponent";
import {CharacterSpriteFactory} from "./factories/game/CharacterSpriteFactory";

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
const cameraControlSystem = container.get(CameraControlSystem);
const inputService = container.get(UserInputService);

engine.addSystem(renderingSystem);
engine.addSystem(cameraControlSystem);

const renderApplication = container.get(RenderApplication);
const loader = renderApplication.getLoader();

loader.add('bgFar', 'assets/bg-far.png');
loader.add('bgMid', 'assets/bg-mid.png');

loader.add('wall', 'assets/wall.json');
loader.add('bunny', 'assets/bunny.json');

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

    const bunnyEntity = new Entity();
    const simpleRenderableComponent = bunnyEntity.putComponent(SimpleRenderableComponent);
    const worldPositionComponent = bunnyEntity.putComponent(WorldPositionComponent);
    const controllableComponent = bunnyEntity.putComponent(ControllableComponent);
    bunnyEntity.putComponent(CharacterAnimationComponent);

    controllableComponent.active = true;

    engine.addEntity(bunnyEntity);

    worldPositionComponent.y = 215;
    worldPositionComponent.x = 120;

    const bunny = container.get(CharacterSpriteFactory).getCharacterAnimation('bunny', 'idle');
    simpleRenderableComponent.sprite = bunny;

    renderApplication.getStage().sortableChildren = true;
    renderApplication.getStage().addChild(bunny);

    const controllableHandlerSystem = container.get(ControllableHandlerSystem);
    inputService.addEventListener(controllableHandlerSystem);
    engine.addSystem(controllableHandlerSystem);
    engine.addEntity(bunnyEntity);

    const characterAnimationSystem = container.get(CharacterAnimationSystem);
    engine.addSystem(characterAnimationSystem);

});