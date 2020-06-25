# Optimal "Hangman" (awful name for a kid’s name!)
Type: Algorithm / implementation
Target time: 60 minutes

## Prompt
This exercise is largely to see how you approach somewhat messy data problems. A proposed algorithm is already included below.

You will be implementing an algorithm that guesses letters in the game of [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)). In short, a secret word is chosen, and a Guesser guesses letters—one at a time—to guess the secret word. Initially, they just have how many letters are in the word. Over time, the Guesser finds out which letters that they’ve guessed are in what positions of the word. Their goal is to guess the word with as few wrong guesses as possible.

As you can imagine, with a dictionary and spare computational resources, the game becomes a lot easier. There is a strategy that is likely optimal for the children’s game of Hangman. Here’s a video that quickly explains it: https://youtu.be/le5uGqHKll8?t=154. 

We’ve provided a dictionary file, `dict.txt`, of every word that you can use during runtime, so your program should be able to make really good guesses. You’ll need to decide how to load the file / store in memory. Implement an algorithm that receives a “board” and previous wrong guesses, and returns a single guess.

Feel free to use TypeScript or JavaScript. If you use JS, you'll have to make minor changes in `package.json`.

While you think about this, consider tradeoffs you’d make for performance. Pretend this will be running in a server with guesses coming in via API. You can make whatever tradeoffs you think are reasonable. Likewise, don’t worry about squeezing out every last millisecond of performance — do what you think would be reasonable that balances effort, maintainability, performance, etc.

## Outcome
Write an implementation of `hangmanGuesser()` that makes guesses for the chidren's game of Hangman. We have provided an algorithm that yields quite optimal guesses given a dictionary, so you will likely want to focus on how you will store and query the dictionary efficiently.

## Setup
Install `nvm`. Run `nvm install && nvm use && npm i`.

Run `npm run start` to run `hangman.ts`.