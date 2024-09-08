import * as blazeface from '@tensorflow-models/blazeface';

let model: blazeface.BlazeFaceModel | null = null;

export const loadModel = async () => {
    if (!model) {
        model = await blazeface.load();
    }
    return model;
};

export const getModel = () => model;
