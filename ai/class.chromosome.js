class Chromosome {
    constructor (inputSize, size) {
        this.size = size;
        this.inputSize = inputSize;
        this.input = '';
        this.fitness = 0;
        this.bias = 0;
        this.neurons = this.createNeurons();
    }

    setBias (bias) {
        for (let i=0; i<this.size; i++) {
            this.neurons[i].setBias(bias);
        }
        this.bias = bias;
    }

    setNeurons (neurons) {
        if (!Array.isArray(neurons)) {
            console.error("Esse não é um Array de Neurons");
            return false;
        }
        if (neurons.length != this.size) {
            console.error("Tamanho dos Neurons diferente (Chomosome)");
            return false;
        }

        var n = Array();
		for (let i=0; i<neurons.length; i++) {
			let nCopy = Object.assign(
				Object.create(
					Object.getPrototypeOf(neurons[i])
				),
				neurons[i]
			);
			n.push(nCopy);
        }
        
        this.neurons = n;

        this.resetFitness();
    }

    createNeurons () {
        var neurons = Array();
        for (let i=0; i<this.size; i++) {
            neurons.push(new Neuron(this.inputSize, this.bias));
        }
        return neurons;
    }

    setInput (input) {
        if (!Array.isArray(input)) input = [input];
        if (input.length != this.inputSize) {
            console.error('Tamanho do input diferente (Chromosome)');
            return false;
        }
        
        this.input = input;

        for (let i=0; i<this.neurons.length; i++) {
            this.neurons[i].setInput(input);
        }
    }

    calculate() {
        if (this.bias == 0) console.error("Bias não está definido (Chromosome)");
        if (this.input.length === 0) {
            console.error('Input vazio (Chromosome)');
            return false;
        }
        var results = Array();
        for (let i=0; i<this.neurons.length; i++) {
            results.push(this.neurons[i].calculate());
        }
        return results;
    }

    mutate (mutation, variation) {
        var pctUnique = 100 / this.neurons.length;
        var mutant = 0;
        var i = 0;
		while (mutant < mutation) {
            if (Math.random() > .7) {
                this.neurons[i].mutate(mutation, variation);
                mutant += pctUnique;
            }
            i++;
            if (i >= this.neurons.length) i = 0;
		}
	}

    setFitness (fitness) {
        this.fitness = fitness;
    }

    addFitness() {
        this.fitness++;
    }

    getFitness () {
        return this.fitness;
    }

    resetFitness () {
        this.fitness = 0;
    }

    print() {
        for (let i=0; i<this.neurons.length; i++) {
            this.neurons[i].print();
        }
    }
}