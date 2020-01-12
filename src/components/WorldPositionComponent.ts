import {Component} from "@nova-engine/ecs";

export class WorldPositionComponent implements Component {
    private _x: number = 0;

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    private _y: number = 0;

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}