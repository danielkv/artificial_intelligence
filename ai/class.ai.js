class AI {
	constructor (NeuralNetwork, populationSize, mutation, variationMutation, maxGenerations) {
		this.maxGenerations = maxGenerations;
		this.NeuralNetwork = NeuralNetwork;
		this.populationSize = populationSize;
		this.population = Array();
		this.mutation = mutation;
		this.variationMutation = variationMutation;
		this.generation = 0;
		this.actualSubject = 0;
		this.learning = false;
		this.numberOfChromosomes = 2;
		this.parentSurvive = true;

		this.init();
	}

	startLearning() {
		this.learning = true;
	}

	stopLearning() {
			this.learning = false;
	}

	init() {
		this.resetGeneration();
		this.createNewPopulation();
	}

	setInput (input) {
		this.NeuralNetwork.setInput(input);
	}

	calculate () {
		return this.NeuralNetwork.calculate();
	}

	resetGeneration () {
		this.actualSubject = 0;
		this.generation++;
	}

	createNewPopulation (startPopulation) {
		if (!startPopulation)
			var newPopulation = Array();
		else
			var newPopulation = startPopulation;

		for (let i=newPopulation.length; i<this.populationSize; i++) {
			newPopulation.push(new Chromosome(this.NeuralNetwork.inputSize, this.NeuralNetwork.hiddenSize));
		}
		this.population = newPopulation;

		this.NeuralNetwork.setHiddenLayer(this.population[this.actualSubject]);

		document.dispatchEvent(new CustomEvent('onNewPopulation', {detail : {population:this.population}}));
	}

	evolve () {
		if (this.learning && this.generation < this.maxGenerations) {
			var bestGens = this.selectBestPopulation();
			var newGeneration = Array();
			var crossover = this.copyChromosome(this.doCrossover(bestGens));
			if (this.parentSurvive) {
				this.resetFitness(bestGens);
				newGeneration = bestGens;
			}
			newGeneration = newGeneration.concat(crossover);

			this.resetGeneration();

			this.createNewPopulation(this.mutate(newGeneration));
		}
	}

	nextSubject () {
		if (this.generation >= this.maxGenerations) this.stopLearning();
		if (!this.learning) return;

		if (this.actualSubject == this.population.length-1) {
			this.evolve();
		} else {
			this.actualSubject++;
			this.NeuralNetwork.setHiddenLayer(this.population[this.actualSubject]);
		}
	}

	mutate (chromosomes) {
		for (let i=0; i<chromosomes.length; i++) {
			chromosomes[i].mutate(this.mutation, this.variationMutation);
		}
		return chromosomes;
	}

	addFitness () {
		if (!this.learning) return;

		this.NeuralNetwork.addFitness();
	}
	
	resetFitness (chromosomes) {
		for (let i=0; i<chromosomes.length; i++) {
			chromosomes[i].resetFitness();
		}
	}

	doCrossover (chromosomes) {

		if (chromosomes.length > 2) {
			console.log("Número máximo de Chromosomes para Crossover é 2");
			return false;
		}
		var sliceSize1 = Math.floor(Math.random()*(this.NeuralNetwork.hiddenSize - 1 + 1) + 1);
		var sliceSize2 = sliceSize1 - this.NeuralNetwork.hiddenSize;

		var n1 = chromosomes[0].neurons;
		var n2 = chromosomes[1].neurons;

		var slice1 = n1.slice(0, sliceSize1-1);
		var slice2 = n1.slice(sliceSize1-1);
		var slice3 = n2.slice(0, sliceSize2-1);
		var slice4 = n2.slice(sliceSize2-1);

		var c1 = slice1.concat(slice4);
		var c2 = slice3.concat(slice2);

		var chromosome1 = new Chromosome(this.NeuralNetwork.inputSize, this.NeuralNetwork.hiddenSize);
		var chromosome2 = new Chromosome(this.NeuralNetwork.inputSize, this.NeuralNetwork.hiddenSize);

		chromosome1.setNeurons(c1);
		chromosome2.setNeurons(c2);

		return [chromosome1, chromosome2];
	}

	copyChromosome(chromosomes) {
		if (!Array.isArray(chromosomes)) chromosomes = [chromosomes];

		var newChromosomes = Array();
		for (let i=0; i<chromosomes.length; i++) {

			var copied = Object.assign(
				Object.create(
					Object.getPrototypeOf(chromosomes[i])
				),
				chromosomes[i]
			);

			copied.setNeurons(chromosomes[i].neurons);

			for (let k=0; k<copied.neurons.length; k++) {
				copied.neurons[k].clone = true;
			}

			newChromosomes.push(copied);
		}

		return newChromosomes;
	}

	sortChromosomes (a, b) {
		if (a.getFitness() > b.getFitness()) {
			return -1;
		} else if (a.getFitness() < b.getFitness()) {
			return 1;
		}

		return -1;
	}

	

	selectBestPopulation () {
		var actualGroup = this.population;
		actualGroup.sort(this.sortChromosomes);
		
		return actualGroup.slice(0,this.numberOfChromosomes);
	}

	//aAQUIUIIIIIIIIIIIII
}