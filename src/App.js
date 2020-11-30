import React, { useEffect, useState } from 'react'
import AllCards from './cards'
import { v4 as uuidv4 } from "uuid";
import './App.scss'

function shuffle(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function randomCardsArray(AllCards) {
  let indexArr = []
  let randomCardsArray = []

  while (indexArr.length < 8) {
    let r = Math.floor(Math.random() * AllCards.length - 1) + 1
    if (indexArr.indexOf(r) === -1) indexArr.push(r) // если сгенерируемого индекса нет в массиве, то он добавляется
  }

  for (let i = 0; i < indexArr.length; i++) {
    randomCardsArray.push(AllCards[indexArr[i]])
  }

  return randomCardsArray
}

function returnUniqId(array) {
  return array.map(el => {
    let copy = Object.assign({}, el);
    copy.uniqId = uuidv4()
    return copy
  })
}

function renderCard(AllCards) {
  const cards = randomCardsArray(AllCards)
    .map((card, index) => ({
      id: index + 1,
      cardURL: `img/${card}`,
      isFliped: true,
    }))
  const card = cards
  const finaleArr = returnUniqId(card.concat(cards))

  return shuffle(finaleArr)
}

function cardsFlipped(array) {
  return array.map(el => {
    let copy = Object.assign({}, el);
    copy.isFliped = false
    return copy
  })
}

function App() {
  const [state, setState] = useState()
  const [init, setInit] = useState()
  const [currentRound, setCurrentRound] = useState(1)
  const [firstCard, setFirstCard] = useState(null)
  const [secondCard, setSecondCard] = useState(null)

  useEffect(() => {
    const game = renderCard(AllCards)
    setState(game)
    setInit(game)
  }, [])

  useEffect(() => {
    if (init) {
      setTimeout(() => {
        setState(cardsFlipped(state))
      }, 3000)
    }
  }, [init])

  useEffect(() => {
    if (firstCard && secondCard) {
      if (secondCard && firstCard.cardId !== secondCard.cardId) {
        setTimeout(() => {
          setCardIsFlipped(firstCard.carduniqId, false)
          setCardIsFlipped(secondCard.carduniqId, false)
          setFirstCard(null)
          setSecondCard(null)
          setCurrentRound(prev => prev + 1)
        }, 1000)
      } else if (firstCard && secondCard && firstCard.cardId === secondCard.cardId) {
        setFirstCard(null)
        setSecondCard(null)
        setCurrentRound(prev => prev + 1)
      }
    }

  }, [firstCard, secondCard])

  function setCardIsFlipped(carduniqId, isFliped) {
    setState(state => state.map(card => {
      if (card.uniqId !== carduniqId) {
        return card;
      }
      return { ...card, isFliped }
    }))
  }

  function setAllCardsAreFlipped(array) {
    return array.map(el => el.isFliped)
  }

  function flipCard(e) {
    const carduniqId = e.target.getAttribute('data-uniqueid')
    const cardId = e.target.getAttribute('data-id')

    if (!firstCard) {
      setFirstCard({ cardId, carduniqId })
      setCardIsFlipped(carduniqId, true)

    } else if (firstCard && !secondCard) {
      setSecondCard({ cardId, carduniqId })
      setCardIsFlipped(carduniqId, true)
    }
    return
  }

  function gameRestart() {

    const arr = setAllCardsAreFlipped(state)
    const el = element => element === false

    if (!arr.some(el) || arr.some(el)) {
      setState(cardsFlipped(state))
    }

    setTimeout(() => {
      setState(renderCard(AllCards))
      setInit(renderCard(AllCards))
      setCurrentRound(1)
      setFirstCard(null)
      setSecondCard(null)
    }, 1000)
  }

  return (
    <React.Fragment>
      <div className='Game'>
        <div className='Game__wrapper'>
          <div className='Game__round'>
            <h1>Current Round: {currentRound}</h1>
          </div>
          <button className='Game__button' onClick={() => gameRestart()}>Try Again!</button>
          <div className='Game__grid'>
            {state
              ? state.map((card, index) => {
                return (
                  <React.Fragment key={index} >
                    <div className={card.isFliped ? 'card-container flipped' : 'card-container'}
                      onClick={(e) => flipCard(e)}
                    >
                      <div className="card-back">
                        <img src={`${card.cardURL}`} alt='картинка' />
                      </div>
                      <div className="card-front" data-uniqueid={card.uniqId} data-id={card.id}>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })
              : null
            }
          </div>
        </div>
      </div>
    </React.Fragment >
  )
}

export default App;
