// This is some boilerplate code for the lab. Only write code where specified.
const readline = require('readline');

const thinkingOf = Math.ceil(Math.random() * 10);
let attemptsCount = 1; // This is a variable that should be incremented on every guess

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// write code only inside the block of this function
function checkAnswer(answer) {
  // if the user has guessed the correct number the if block should execute
  if () {
    console.log(`Guessed "${answer}" correctly in ${attemptsCount} attempts!`);
    // print a string that tells the user what the answer is and how many attempts it took.

    rl.close(); // do not remove this line
  } else {

    rl.question('Nope. Try again.\n> ', checkAnswer); // this code will ask the user to enter another number
  }
}

rl.question(
  "I'm thinking of a number between 1 and 10 inclusive\n> ",
  checkAnswer,
);
