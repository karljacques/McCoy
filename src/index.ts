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
import {UserInputService} from "./services/input/UserInputService";
import {CameraControlSystem} from "./system/camera/CameraControlSystem";
import {RenderableComponent} from "./components/rendering/RenderableComponent";
import {WorldPositionComponent} from "./components/WorldPositionComponent";
import {ControllableComponent} from "./components/input/ControllableComponent";
import {ControllableHandlerSystem} from "./system/entity/ControllableHandlerSystem";
import {CharacterAnimationSystem} from "./system/entity/CharacterAnimationSystem";
import {CharacterAnimationComponent} from "./components/CharacterAnimationComponent";
import {CharacterSpriteFactory} from "./factories/game/CharacterSpriteFactory";
import {WallGenerationSystem} from "./system/entity/WallGenerationSystem";
import {Bodies, Bounds, Render, Vector, World} from "matter-js";
import {PhysicsSystem} from "./system/PhysicsSystem";
import {PhysicsComponent} from "./components/PhysicsComponent";
import {PhysicsService} from "./services/PhysicsService";

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

// If you enable DEBUG_PHYSICS, Matter.js will render its own interpretation of what's
// going on
const DEBUG_PHYSICS = true;

if (DEBUG_PHYSICS) {
    const physicsEngine = container.get(PhysicsService).engine;
    const render = Render.create({
        element: document.body,
        engine: physicsEngine,
        options: {
            hasBounds: true
        }
    });

    Bounds.translate(render.bounds, Vector.create(-200, -200));

    Render.run(render);
}

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


    const bunnyEntity = new Entity();
    const simpleRenderableComponent = bunnyEntity.putComponent(RenderableComponent);
    const worldPositionComponent = bunnyEntity.putComponent(WorldPositionComponent);
    const controllableComponent = bunnyEntity.putComponent(ControllableComponent);
    bunnyEntity.putComponent(CharacterAnimationComponent);

    controllableComponent.active = true;

    engine.addEntity(bunnyEntity);

    worldPositionComponent.y = 15;
    worldPositionComponent.x = 120;

    const bunny = container.get(CharacterSpriteFactory).getCharacterAnimation('bunny', 'idle');
    simpleRenderableComponent.sprite = bunny;
    bunny.anchor.set(0.5, 0.5);

    renderApplication.getStage().sortableChildren = true;
    renderApplication.getStage().addChild(bunny);

    const controllableHandlerSystem = container.get(ControllableHandlerSystem);
    inputService.addEventListener(controllableHandlerSystem);
    engine.addSystem(controllableHandlerSystem);
    engine.addEntity(bunnyEntity);

    const physicsComponent = bunnyEntity.putComponent(PhysicsComponent);
    physicsComponent.box = Bodies.rectangle(100, -300, bunny.width, bunny.height);
    World.add(container.get(PhysicsService).engine.world, [physicsComponent.box]);


    const characterAnimationSystem = container.get(CharacterAnimationSystem);
    engine.addSystem(characterAnimationSystem);

    engine.addSystem(container.get(WallGenerationSystem));
    engine.addSystem(container.get(PhysicsSystem));
});