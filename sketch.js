var ai, c;

function setup() {
    document.addEventListener('onFrame', function (e) {
        let g = e.detail;
        ai.setInput([g.ballPositionX+(g.ballWidth/2), g.racketPositionX+(g.racketWidth/2)]);
        let result = ai.calculate()[0];
        var go;

        if (result>0.66) {
            go = 'right';
           
        } else if (result<0.33) {
            go = 'left';
        } else {
            go = result;
        }

        Game.forceInput(go);

        if (g.misses > 3) {
            ai.nextSubject();
            Game.resetGame();
        }

        if (g.status == 'hit') {
            ai.addFitness();
        }

        //AI

        document.getElementById('population').innerHTML = 'População: ' + ai.populationSize;
        document.getElementById('subject').innerHTML = 'Sujeito: ' + ai.actualSubject;
        document.getElementById('generation').innerHTML = 'Geração: ' + ai.generation;
        document.getElementById('fitness').innerHTML = 'Fitness Atual: ' + ai.NeuralNetwork.hiddenLayer.getFitness();

        c.resetChromosomes(ai.population);
        c.addChromosomes(ai.population);
        c.draw();
    });

    /*document.addEventListener('onResetBall', function (e) {
        let g = e.detail;
        
    });*/

    document.addEventListener('onNewPopulation', function (e) {
        let population = e.detail.population;
        c.addChromosomes(population);
        c.draw();
    });
}

$(function () {   

    var nn = new NeuralNetwork(2, 5, 1, 0.2);
    ai = new AI(nn, 7, .02, .2, 100);

    ai.startLearning();

    c = new DrawChromosomes(250, nn);

    new Game();
    
    setup();

    //console.log(ai.populationSize);

    
});
