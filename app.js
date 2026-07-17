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
const maxPasses = 5

function App () {
  /*
   * Retrieve Game data from the previous game, if not set to null
   */
  const savedGame = JSON.parse(localStorage.getItem('scrambleGame'))

  /*
   * shuffle the word list once when start the game
   */
  const [gameWords, setGameWords] = React.useState(
    savedGame ? savedGame.gameWords : shuffle(words)
  )

  /*
   * wordIndex show where the user are
   */
  const [wordIndex, setWordIndex] = React.useState(
    savedGame ? savedGame.wordIndex : 0
  )

  const [guess, setGuess] = React.useState('')

  const [points, setPoints] = React.useState(
    savedGame ? savedGame.points : 0
  )

  const [strikes, setStrikes] = React.useState(
    savedGame ? savedGame.strikes : 0
  )

  const [passes, setPasses] = React.useState(
    savedGame ? savedGame.passes : maxPasses
  )

  const [message, setMessage] = React.useState(
    savedGame ? savedGame.message : ''
  )

  const [gameOver, setGameOver] = React.useState(
    savedGame ? savedGame.gameOver : false
  )

  /*
   * current word
   */
  const currentWord = gameWords[wordIndex]

  /*
   * Scrambled current word
   */
  const [scrambledWord, setScrambledWord] = React.useState(
    savedGame
      ? savedGame.scrambledWord
      : shuffle(gameWords[0])
  )

  /*
   * Once the process change, save to local storage
   */
  React.useEffect(() => {
    const gameData = {
      gameWords,
      wordIndex,
      scrambledWord,
      points,
      strikes,
      passes,
      message,
      gameOver
    }

    localStorage.setItem(
      'scrambleGame',
      JSON.stringify(gameData)
    )
  }, [
    gameWords,
    wordIndex,
    scrambledWord,
    points,
    strikes,
    passes,
    message,
    gameOver
  ])

  /*
   * next word
   */
  function nextWord () {
    const nextIndex = wordIndex + 1

    /*
     * no word left -> win
     */
    if (nextIndex >= gameWords.length) {
      setGameOver(true)
      setMessage('You won!')
      return
    }

    setWordIndex(nextIndex)
    setScrambledWord(shuffle(gameWords[nextIndex]))
  }

  /*
   * run when user enter
   */
  function handleSubmit (event) {
    event.preventDefault()

    const playerGuess = guess.trim().toLowerCase()

    /*
     * delete text box
     */
    setGuess('')

    if (playerGuess === '') {
      return
    }

    /*
     * guess the word correctly
     */
    if (playerGuess === currentWord) {
      setPoints(points + 1)
      setMessage('Correct!')
      nextWord()
    } else {
      /*
       * guess the word not correctly
       */
      const newStrikes = strikes + 1

      setStrikes(newStrikes)
      setMessage('Incorrect!')

      /*
       * lost when out of strikes
       */
      if (newStrikes >= maxStrikes) {
        setGameOver(true)
        setMessage('You lost.')
      }
    }
  }

  /*
   * pass the word
   */
  function handlePass () {
    if (passes === 0) {
      return
    }

    setPasses(passes - 1)
    setMessage('Word passed.')
    nextWord()
  }

  /*
   * replay the game again
   */
  function playAgain () {
    const newWords = shuffle(words)

    setGameWords(newWords)
    setWordIndex(0)
    setScrambledWord(shuffle(newWords[0]))
    setGuess('')
    setPoints(0)
    setStrikes(0)
    setPasses(maxPasses)
    setMessage('')
    setGameOver(false)

    localStorage.removeItem('scrambleGame')
  }

  return (
    <main>
      <h1>Welcome to Scramble.</h1>

      <div className="score">
        <div>
          <span>{points}</span>
          <p>POINTS</p>
        </div>

        <div>
          <span>{strikes}</span>
          <p>STRIKES</p>
        </div>
      </div>

      {message && (
        <p className="message">{message}</p>
      )}

      {!gameOver ? (
        <section>
          <h2>{scrambledWord}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              autoFocus
            />
          </form>

          <button
            type="button"
            onClick={handlePass}
            disabled={passes === 0}
          >
            {passes} Passes Remaining
          </button>
        </section>
      ) : (
        <button type="button" onClick={playAgain}>
          Play Again
        </button>
      )}
    </main>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)

root.render(<App />)