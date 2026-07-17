/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

//List of words
const words = [
  'cancer',
  'aquarius',
  'leo',
  'virgo',
  'aries',
  'scorpio',
  'sagittarius',
  'taurus',
  'capricorn',
  'pisces',
  'gemini',
  'libra'
]

const maxStrikes = 3
const skips = 5


//make a scrambled word using shuffle function 
function scrambleWord (word) {
  let scrambled = shuffle(word)

  while (scrambled === word && word.length > 1) {
    scrambled = shuffle(word)
  }

  return scrambled
}

//when page load, take the game data (as an object) from local storage without refresh the data
const savedGame = JSON.parse(localStorage.getItem('scrambleGame'))

function App(){

  const startingWords = savedGame ? savedGame.remainingWords : shuffle(words)
  const startingWord = startingWords.length > 0 ? startingWords[0] : ''

  //save the unfinished words
  const [remainingWords, setRemainingWords] = React.useState(startingWords)
  //save the scrambled words
  const [scrambledWord, setScrambledWord] = React.useState(
    savedGame ? savedGame.scrambledWord : scrambleWord(startingWord)
  )

  //save the guessing words
  const [guess, setGuess] = React.useState('')

  //save the strikes
  const [strikes, setStrikes] = React.useState(savedGame ? savedGame.strikes : 0)
  const [passes, setPasses] = React.useState(savedGame ? savedGame.passes : startingPasses)

  //game over or still continue
  
  const currentWord = remainingWords[0]

  // Save the game whenever the player's progress changes.
  React.useEffect(() => {
    const gameData = {
      remainingWords,
      scrambledWord,
      points,
      strikes,
      passes,
      message,
      gameOver
    }

    localStorage.setItem('scrambleGame', JSON.stringify(gameData))
  }, [remainingWords, scrambledWord, points, strikes, passes, message, gameOver])
  

  function showNextWord (newWords) {
    if (newWords.length === 0) {
      setScrambledWord('')
      setMessage('You completed every word!')
      setGameOver(true)
      return
    }

    setScrambledWord(scrambleWord(newWords[0]))
  }

  function handleSubmit (event) {
    event.preventDefault()

    const playerGuess = guess.trim().toLowerCase()
    setGuess('')

    if (playerGuess === '') {
      setMessage('Please type a guess first.')
      return
    }

    if (playerGuess === currentWord.toLowerCase()) {
      const newWords = remainingWords.slice(1)

      setPoints(points + 1)
      setRemainingWords(newWords)
      setMessage('Correct! Here is the next word.')
      showNextWord(newWords)
    } else {
      const newStrikes = strikes + 1

      setStrikes(newStrikes)

      if (newStrikes >= maxStrikes) {
        setMessage(`Game over! The word was "${currentWord}".`)
        setGameOver(true)
      } else {
        setMessage('Incorrect. Try the same word again.')
      }
    }
  }

  function handlePass () {
    if (passes <= 0 || gameOver) {
      return
    }

    const newWords = remainingWords.slice(1)

    setPasses(passes - 1)
    setRemainingWords(newWords)
    setMessage(`Passed! The word was "${currentWord}".`)
    showNextWord(newWords)
  }

  function restartGame () {
    const newWords = shuffle(words)

    setRemainingWords(newWords)
    setScrambledWord(scrambleWord(newWords[0]))
    setGuess('')
    setPoints(0)
    setStrikes(0)
    setPasses(startingPasses)
    setMessage('New game started. Unscramble the word below.')
    setGameOver(false)
  }

  return (
    <main className="game">
      <h1>Scramble</h1>
      <p className="instructions">Guess the original word before you get {maxStrikes} strikes.</p>

      <section className="scoreboard">
        <p>Points: <strong>{points}</strong></p>
        <p>Strikes: <strong>{strikes}/{maxStrikes}</strong></p>
        <p>Passes: <strong>{passes}</strong></p>
        <p>Words left: <strong>{remainingWords.length}</strong></p>
      </section>

      {!gameOver ? (
        <section className="play-area">
          <p className="label">Scrambled word</p>
          <p className="scrambled-word">{scrambledWord}</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="guess">Your guess</label>
            <input
              id="guess"
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              autoComplete="off"
              autoFocus
            />

            <div className="buttons">
              <button type="submit">Guess</button>
              <button
                type="button"
                className="secondary"
                onClick={handlePass}
                disabled={passes === 0}
              >
                Pass
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="game-over">
          <h2>Game Over</h2>
          <p>Your final score is {points}.</p>
          <button type="button" onClick={restartGame}>Play Again</button>
        </section>
      )}

      <p className="message" aria-live="polite">{message}</p>
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)


