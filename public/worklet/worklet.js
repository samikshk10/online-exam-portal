class NoiseLevelProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._rms = 0;
        this._frameCount = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const samples = input[0];
            let sum = 0;
            for (let i = 0; i < samples.length; i++) {
                sum += samples[i] * samples[i];
            }
            const rms = Math.sqrt(sum / samples.length);
            this.port.postMessage(rms);
        }
        return true;
    }
}

registerProcessor('noise-level-processor', NoiseLevelProcessor);
