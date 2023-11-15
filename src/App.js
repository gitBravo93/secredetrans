import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Button from 'react-bootstrap/Button';
import imagen from './images/fondo.png'

import { images } from './import';

function App() {

  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState({});
  const [secondCard, setSecondCard] = useState({});

  const [unflippedCards, setUnflippedCards] = useState([]);
  const [disabledCards, setDisabledCards] = useState([]);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    if (firstCard.name && Object.keys(secondCard).length === 0) {
      iniciarDetenerCronometro();
    }
  }, [firstCard, secondCard]);

  

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  
  const reset = () => {
    window.location.reload();
  }

  useEffect(() => {
    shuffleArray(images);
    setCards(images);
  }, [])

  useEffect(() => {
    checkForMatch();
  }, [secondCard]);

  const flipCard = (name, number) => {
    if (firstCard.name === name && firstCard.number === number) {
      return 0;
    }
    if (!firstCard.name) {
      setFirstCard({ name, number });
    }
    else if (!secondCard.name) {
      setSecondCard({ name, number });
    }
    return 1;
  }

  const checkForMatch = () => {
    if (firstCard.name && secondCard.name) {
      const match = firstCard.name === secondCard.name;
      match ? disableCards() : unflipCards();
    }
  }

  useEffect(() => {
    let intervalID;

    if (corriendo) {
      intervalID = setInterval(() => {
        setSegundos((prevSegundos) => prevSegundos + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [corriendo]);

  const iniciarDetenerCronometro = () => {
    setCorriendo(!corriendo);
  };

  const disableCards = () => {
    setDisabledCards((prevDisabledCards) => [
      ...prevDisabledCards,
      firstCard.number,
      secondCard.number,
    ]);
    resetCards();
  };

  const unflipCards = () => {
    setUnflippedCards([firstCard.number, secondCard.number]);
    resetCards();
  };

  const resetCards = () => {
    setFirstCard({});
    setSecondCard({});
  }

  return (
    <div className='app'>
      <div className='cards-container mb-4' style={{ backgroundImage: "url(./imagen.png)" }} >
        <div className='titulo mb-5'>
          MEMOVIAL SECRETARIA DE TRANSPORTE 
        </div>   
        <img className='fondo' src={imagen}/>
      
         {
          cards.map((card, index) => {
            const isHidden = disabledCards.includes(index);
            return (
              <Card
                key={index}
                name={card.player}
                number={index}
                frontFace={card.src}
                flipCard={flipCard}
                unflippedCards={unflippedCards}
                disabledCards={disabledCards}
                isHidden={isHidden}
              />
            );
          })
        }

      </div>
      <div className='reloj'>
      <div className='relojcentro'>{`${Math.floor(segundos / 3600)
      .toString()
      .padStart(2, '0')}:${Math.floor((segundos % 3600) / 60)
      .toString()
      .padStart(2, '0')}:${(segundos % 60).toString().padStart(2, '0')}`}</div>
    </div>
      <div className='btn mt-5'>
         <Button onClick={reset}>
           Nuevo Juego
         </Button>
      </div>
    </div>
  );
}

export default App;
