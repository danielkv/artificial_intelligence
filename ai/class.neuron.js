class Neuron {
    constructor (inputSize) {
        this.inputSize = inputSize;
        this.bias = 0;
        this.input = '';
        this.clone = false;
        this.createWeights();
        
        Neuron.instanceCount = Neuron.instanceCount ? Neuron.instanceCount+1 : 1;
        
        this.instance = Neuron.instanceCount;
    }

    setBias (bias) {
        this.bias = bias;
    }

    createWeights () {
        this.weights = Array();
        for (var i=0; i<this.inputSize; i++) {
            this.weights[i] = Math.random() * 2 - 1;
        }
    }
    
    setInput (input) {
        if (!Array.isArray(input)) input = [input];
        if (input.length != this.inputSize) {
            console.error('Tamanho do input diferente (Neuron)');
            return false;
        }
        this.input = input;
    }

    calculateOutputs() {
        if (this.input.length === 0) {
            console.error('Input vazio (Neuron)');
            return false;
        }
        var outputs = Array();
        for (let i=0; i<this.inputSize; i++) {
            outputs[i] = this.input[i] * this.weights[i] * this.bias;
        }
        this.outputs = outputs;

        return outputs;
    }

    calculateResult () {
        if (this.input.length === 0) {
            console.error('Input vazio (Neuron)');
            return false;
        }
        var result = 0;
        
        for (let i=0; i<this.outputs.length; i++) {
            result += this.outputs[i];
            
        }
        this.result = result;

        return result;
    }

    mutate (mutation, variation) {
        var m = mutation * ((Math.random() * variation) -1);
        var newWeights = this.weights;
        for (let i=0; i<this.weights.length; i++) {
            if (Math.random() > .5) {
                newWeights[i] = this.weights[i] + m;
            } else {
                newWeights[i] = this.weights[i] - m;
            }
        }
        this.weights = newWeights;
    }

    calculate () {
        if (this.bias == 0) console.error("Bias não está definido (Neuron)");

        if (this.input.length === 0) {
            console.error('Input vazio (Neuron)');
            return false;
        }
        this.calculateOutputs();
        return this.calculateResult();
    }

    getOutputs() {
        return this.outputs;
    }

    getResult() {
        return this.result;
    }

    print() {
        console.table(this.input);
        console.table(this.weights);
    }
}