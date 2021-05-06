//Import
import Game from './game.js';

//Canvas Setup
let canvas = document.getElementById('gameScreen');
canvas.width = 800;
canvas.height = 600;

//Create Game
let game = new Game(canvas);

//HTML elements
const menuContainer = document.getElementById("container1") ;
const startGameBtn = document.getElementById("startButton") ;
const gameScore = document.getElementById("score");
const gameHealth = document.getElementById("health");


startGameBtn.addEventListener('click',()=>{
    menuContainer.style.display="none";
    gameScore.style.display="flex";
    gameHealth.style.display="flex";
    
    //Start Game
    game.startGame(60);
    
});

//Reset game
export function deleteGame(){
    //Hide from display
    gameScore.style.display="none";
    gameHealth.style.display="none";

    //Show score
    menuContainer.style.display="flex";
    
    game=new Game(canvas);
}
