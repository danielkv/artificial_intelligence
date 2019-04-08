class NeuralNetwork {
    constructor (inputSize, hiddenSize, outputSize, bias) {
        this.bias = bias;
        this.input = '';
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.hiddenSize = hiddenSize;

        this.createOutputLayer();
    }

    setInput (input) {
        if (!Array.isArray(input)) input = [input];
        if (input.length == this.inputSize)
            this.input = input;
        else
            console.error("Entrada tem tamanho diferente. (Neural Network)");

        this.hiddenLayer.setInput(input);
    }

    calculate() {
        if (this.input.length === 0) {
            console.error('Input vazio (Neural Network)');
            return false;
        }
        var resultHidden = this.hiddenLayer.calculate();

        this.outputLayer.setInput(resultHidden);

        var resultOutput = this.outputLayer.calculate();
        if (!resultOutput) {
            console.error("Erro ao calcular camada de saída", resultOutput);
            //return false;
        }

        //return resultOutput;
        return this.serializeResult(resultOutput);
    }

    serializeResult(result) {
        var r = Array();
        for (let i=0; i<result.length; i++) {
            r.push(this.sigmoid(result[i]));
        }
        return r;
    }

    sigmoid (x) {
        return 1/(1+Math.pow(Math.E, -x));
    }

    setHiddenLayer (hiddenLayer) {
        if (hiddenLayer instanceof Chromosome) {
            this.hiddenLayer = hiddenLayer;
            this.hiddenLayer.setBias(this.bias);
        } else
            console.error("Hidden Layer não é do tipo 'Chromosome'.");
    }

    createOutputLayer () {
        var outputLayer = new Chromosome(this.hiddenSize, this.outputSize);
        this.outputLayer = outputLayer;
        this.outputLayer.setBias(this.bias);
        return outputLayer;
    }

    addFitness () {
        this.hiddenLayer.addFitness();
    }
    
    print() {
        console.table(this.input);
        this.hiddenLayer.print();
        //console.table();
        //console.table(this.outputLayer);
    }
}