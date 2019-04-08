class DrawChromosomes  {
    constructor (canvasWidth, NeuralNetwork) {
       
        this.NeuralNetwork = NeuralNetwork;
        this.canvasDrawn = false;
		this.layers = NeuralNetwork.hiddenSize;

        //SPACES
        this.margin = canvasWidth / 20;
        
        //CANVAS
        this.background = '#cccccc';
        this.canvasWidth = canvasWidth;
        this.canvasHeight = this.canvasWidth / this.layers;
        this.canvas;
        this.ctx;

        this.chromosomes = [];
        

        //NEURONS
        this.neuronWidth = ((this.canvasWidth-this.margin) / this.layers) - this.margin;
        this.neuronsColor = Array();
        this.neuronColor = '#2196f3';
		this.neuronCloneColor = '#000';
		this.neuronTestingColor = '#cc7c0f';
        this.instanceColors = false;
        this.neuronTextColor = '#ffffff';
        this.neuronTextSize = canvasWidth / 16;

        //OFFSET
        this.offsetX = this.margin;
        this.offsetY = this.margin;
    }

    createCanvas() {
        if (!this.canvasDrawn) {

            var canvas = document.createElement("canvas");
            canvas.id = "chromosome_canvas";
            canvas.width = this.canvasWidth+ 100;
            canvas.height = this.canvasHeight;
            document.body.appendChild(canvas);

            this.canvas = canvas;

            if (this.canvas.getContext) {
                this.ctx = this.canvas.getContext("2d");
            } else {
                console.error('Canvas sem contexto');
            }

            this.canvasDrawn = true;
        } else {
            //resize
            this.canvas.height = this.canvasHeight;
        }
    }

    resizeCanvas() {
        this.canvasHeight = (this.neuronWidth+this.margin) * this.chromosomes.length + this.margin;
    }

    setBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect (0, 0, this.canvas.width, this.canvas.height);
    }

    resetChromosomes () {
        this.chromosomes = Array();
    }

    addChromosomes (Chromosomes) {
        if (!Array.isArray(Chromosomes)) Chromosomes = [Chromosomes];
        this.chromosomes = this.chromosomes.concat(Chromosomes);
    }

    draw () {
        this.resizeCanvas();
        this.createCanvas();
        this.setBackground();

        for (let i=0; i<this.chromosomes.length; i++) {
            let oY = this.offsetY + (i * (this.neuronWidth + this.margin));
            this.drawChromosome(this.chromosomes[i], this.offsetX, oY);
        }
    }

    drawChromosome(Chromosome, offsetX, offsetY) {
        for (let i=0; i<Chromosome.neurons.length; i++) {
            let neuron = Chromosome.neurons[i];
            let oX = offsetX + (i * (this.neuronWidth+this.margin));
			let oY = offsetY;

			let color = this.instanceColors ? this.getNeuronColor(Neuron) : this.neuronColor;
            this.drawNeuron(neuron, color, oX, oY);
        }

        //FITNESS
        this.ctx.font = '18px sans-serif';
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText(Chromosome.getFitness(), offsetX+this.canvasWidth, offsetY+15);
    }

    drawNeuron (Neuron, color, offsetX, offsetY) {
        let oX = offsetX+this.neuronWidth/2;
        let oY = offsetY+this.neuronWidth/2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(oX, oY, this.neuronWidth/2, 0, Math.PI * 2, false);
        this.ctx.fill();

        //ID
        this.ctx.font = this.neuronTextSize + 'px sans-serif';
        this.ctx.fillStyle = this.neuronTextColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillText(Neuron.instance, oX, oY);

        //CLONE
        if (Neuron.clone) {
            this.ctx.fillStyle = this.neuronCloneColor;
            this.ctx.beginPath();
            this.ctx.arc(oX+(this.neuronWidth/2), oY-this.neuronWidth/2, this.neuronWidth/5, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
    }

    getNeuronColor(Neuron) {
        let color = this.neuronsColor[Neuron.instance];
        //console.log(this.generationColor);
        if (!color) {
            color = "rgb("+(Math.floor(Math.random()*255)+20)+", "+(Math.floor(Math.random()*255)+20)+", "+(Math.floor(Math.random()*255)+20)+")";
            this.neuronsColor.push(color);
        }
        return color;
    }
}