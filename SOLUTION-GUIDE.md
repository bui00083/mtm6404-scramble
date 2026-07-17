# Scramble Assignment Guide

## Run the project

Open the project with VS Code and use Live Server to open `index.html`.

## Main game states

- `remainingWords`: words that have not been completed or passed
- `scrambledWord`: scrambled version shown on screen
- `guess`: textbox value
- `points`: correct answers
- `strikes`: incorrect answers
- `passes`: passes left
- `message`: feedback to the player
- `gameOver`: controls the play screen and game-over screen

## Main functions

- `scrambleWord()`: scrambles one word
- `handleSubmit()`: checks the player's guess
- `handlePass()`: removes the current word and uses one pass
- `showNextWord()`: displays the next word or ends the game
- `restartGame()`: resets all game values without refreshing

## Local storage

The game saves one object under the key `scrambleGame`. React saves it through `useEffect()` whenever the game progress changes.
