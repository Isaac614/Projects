let userScore = 0;
let computerScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");

main();

function main() {
    rock_div.addEventListener("click", function() {
        console.log("hey you clicked on rock");
        game("r");
    });

    paper_div.addEventListener("click", function() {
        console.log("hey you clicked on paper");
        game("p");
    });

    scissors_div.addEventListener("click", function() {
        console.log("hey you clicked on scissors");
        game("s");
    });
}

function game(userChoice) {
    console.log("User's choice is: " + userChoice);
    const computerChoice = getComputerChoice();
    console.log(computerChoice);
    switch (userChoice + computerChoice) {
        case "rs":
        case "pr":
        case "sp":
            win(userChoice, computerChoice);
            break;
        
        case "rp":
        case "ps":
        case "sr":
            lose(userChoice, computerChoice);
            break;
        
        case "rr":
        case "pp":
        case "ss":
            draw();
    }
    
}

function getComputerChoice() {
    const choices = ["r", "p", "s"];
    const i = Math.floor(Math.random()*3);
    return choices[i];
}

function win(user, computer) {
    console.log("user wins");
    userScore ++;
    console.log(`user score is now ${userScore}`);

    userScore_span.innerHTML = userScore;
    result_p.innerHTML = convertToWord(user).charAt(0).toUpperCase() + convertToWord(user).slice(1) + " beats " + convertToWord(computer) + ". You win!";
}

function lose(user, computer) {
    console.log("user loses");
    computerScore ++;
    console.log(`computer score is now ${computerScore}`);

    computerScore_span.innerHTML = computerScore;
    result_p.innerHTML = convertToWord(computer).charAt(0).toUpperCase() + convertToWord(computer).slice(1) + " beats " + convertToWord(user) + ". You lost!";
}

function draw() {
    console.log("It's a draw");

    result_p.innerHTML = "It's a tie!";
}

function convertToWord(letter) {
    switch(letter) {
        case "r":
            return "rock";
        case "p":
            return "paper";
        case "s":
            return "scissors";
    }
}