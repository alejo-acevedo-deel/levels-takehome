import fs from "fs";
import readline from "readline";

// Load dict.txt, store in `words`.
// This gets you started, but feel free to entirely change how this works if you prefer.
async function loadFile(filename: string): Promise<Array<string>> {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const dict = [];
  for await (const line of rl) {
    dict.push(line);
  }
  return dict;
}

let words: Array<string> = [];
async function run() {
  words = await loadFile("dict.txt");
  // hangmanGuesser can now use `words`

  // Feel free to create test cases.

   // we'd expect 'o' as a guess
  const glucoseGuess = hangmanGuesser(["g", "l", "u", "c", null, "s", "e"], []);
  console.log(`glucose:\t'o' vs ${glucoseGuess}`);

   // we'd expect 'a' as a guess
  const aardvarkGuess = hangmanGuesser(
    [null, null, "r", "d", "v", null, "r", "k"],
    ["o", "e"]
  );
  console.log(`aardvark:\t'a' vs ${aardvarkGuess}`);

   // we'd expect null as a guess since there is no possible word
  const fakeGuess = hangmanGuesser(
    ["x", "x", null, null, null, null, null, null, "x"],
    []
  );
  console.log(`fake word:\tnull vs ${fakeGuess}`);

  return;
}


/**
 * Makes guesses in a game of Hangman using a dictionary.
 * Implements algorithm described in https://youtu.be/le5uGqHKll8?t=154
 *
 * `board` is an Array of letters (single character, lowercase) or blanks, represented as `null`.
 * Example:
 *    [null, null, null, null]: a four letter word, unknown letters
 *    [null, 'e', null, null, null]: a five letter word who's second letter is 'e'.
 *
 * `wrongGuesses` is an array of single character, lowercase strings of previous wrong guesses.
 * No letters occuring in this array will be in the result word.
 *
 * Assume that `hangmanGuesser()` will be called many times in its lifecycle
 *
 * Return value is a string with a single lowercase letter guess, or null if no guess is possible.
 * @param board
 * @param wrongGuesses
 */
function hangmanGuesser(board: Array<string | null>, wrongGuesses: Array<string>): string | null {
  // Please implement.
  return null; // todo!
}

run();
