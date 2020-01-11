import {fluentProvide} from "inversify-binding-decorators";

const sharedProvide = function (identifier: any) {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export {sharedProvide}