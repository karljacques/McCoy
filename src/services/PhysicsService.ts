import {sharedProvide} from "../util/SharedProvide";
import * as Matter from "matter-js";
import {Engine} from "matter-js";

@sharedProvide(PhysicsService)
export class PhysicsService {
    constructor() {
        this._engine = Matter.Engine.create();

        Engine.run(this.engine);
    }

    protected _engine: Matter.Engine;

    get engine(): Matter.Engine {
        return this._engine;
    }
}