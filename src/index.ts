import "reflect-metadata";
import {Engine} from "@nova-engine/ecs";
import {RenderingSystem} from "./system/render/RenderingSystem";
import {Container} from "inversify";
import {buildProviderModule} from "inversify-binding-decorators";

const container = new Container();

container.load(buildProviderModule());

// https://nova-engine.github.io/ecs/
// This is the game engine - a collection of Systems.
// Systems operate on Components, an Entity consists of Components.
const engine = new Engine();

// Instantiate our rendering system, which uses PixiJS and register it with the engine
// The engine will call the update() method of the system every game loop
// It also calls the onAttach hook
const renderingSystem = container.get(RenderingSystem);

engine.addSystem(renderingSystem);