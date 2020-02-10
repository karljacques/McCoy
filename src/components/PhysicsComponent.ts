import {Component} from "@nova-engine/ecs";
import {Body} from "matter-js";

export class PhysicsComponent implements Component {
    private _box: Body;


    get box(): Matter.Body {
        return this._box;
    }

    set box(value: Matter.Body) {
        this._box = value;
    }
}