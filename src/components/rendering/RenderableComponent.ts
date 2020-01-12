import {Component} from "@nova-engine/ecs";

export class RenderableComponent implements Component {
    static readonly tag = 'RenderableComponent';

    setScreenPosition(x: number, y: number): void {
        throw new Error('You need to implement setScreenPosition in the child');
    }
}