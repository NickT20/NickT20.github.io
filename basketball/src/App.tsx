import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Dice } from './Dice';
import { Player } from './Player';

interface Shots {
  insideShots: number;
  insideMakes: number;
  outsideShots: number;
  outsideMakes: number;
}

function App() {
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [player1, setPlayer1] = useState<Player>(new Player())
  const [player2, setPlayer2] = useState<Player>(new Player())
  const [player1Ball, setPlayer1Ball] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("")
  const [player1Shots, setPlayer1Shots] = useState<Shots>({ insideMakes: 0, insideShots: 0, outsideMakes: 0, outsideShots: 0 })
  const [player2Shots, setPlayer2Shots] = useState<Shots>({ insideMakes: 0, insideShots: 0, outsideMakes: 0, outsideShots: 0 })

  const createNewPlayers = () => {
    setPlayer1(new Player());
    setPlayer2(new Player());
    setPlayer1Score(0);
    setPlayer2Score(0);
  }

  const playPossession = () => {
    if (player1Ball) {
      const inside = player1.ShootingTendancy > Dice.RollD100();
      const offense = (inside ? player1.InsideShooting : player1.OutsideShooting) + Dice.RollD20();
      const defense = player2.Defense + Dice.RollD20();
      if (offense > defense) { 
        if (inside) {
          setMessage("Player 1 made inside shot");
          setPlayer1Score(player1Score + 2);
          setPlayer1Shots(shots => ({
            ...shots,
            insideShots: shots.insideShots + 1,
            insideMakes: shots.insideMakes + 1
          }));
        } else {
          setMessage("Player 1 made outside shot");
          setPlayer1Score(player1Score + 3);
          setPlayer1Shots(shots => ({
            ...shots,
            outsideShots: shots.outsideShots + 1,
            outsideMakes: shots.outsideMakes + 1
          }));
        }
      } else {
        if (inside) {
          setMessage("Player 1 missed inside shot");
          setPlayer1Shots(shots => ({
            ...shots,
            insideShots: shots.insideShots + 1,
          }));
        } else {
          setMessage("Player 1 missed outside shot");
          setPlayer1Shots(shots => ({
            ...shots,
            outsideShots: shots.outsideShots + 1,
          }));
        }
      }
    } else {
      const inside = player2.ShootingTendancy > Dice.RollD100();
      const offense = (inside ? player2.InsideShooting : player2.OutsideShooting) + Dice.RollD20();
      const defense = player1.Defense + Dice.RollD20();
      if (offense > defense) { 
        if (inside) {
          setMessage("Player 2 made inside shot");
          setPlayer2Score(player2Score + 2);
          setPlayer2Shots(shots => ({
            ...shots,
            insideShots: shots.insideShots + 1,
            insideMakes: shots.insideMakes + 1
          }));
        } else {
          setMessage("Player 2 made outside shot");
          setPlayer2Score(player2Score + 3);
          setPlayer2Shots(shots => ({
            ...shots,
            outsideShots: shots.outsideShots + 1,
            outsideMakes: shots.outsideMakes + 1
          }));
        }
      } else {
        if (inside) {
          setMessage("Player 2 missed inside shot");
          setPlayer2Shots(shots => ({
            ...shots,
            insideShots: shots.insideShots + 1,
          }));
        } else {
          setMessage("Player 2 missed outside shot");
          setPlayer2Shots(shots => ({
            ...shots,
            outsideShots: shots.outsideShots + 1,
          }));
        }
      }
    }

    setPlayer1Ball(!player1Ball);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={createNewPlayers}>
         Create Players
        </button>
      </div>
      <div style={{display:"flex", flexDirection:"row"}}>
        <div className="card">
          <h2>Player 1</h2>
          <div><span><strong>Outside Shooting:</strong></span> {player1.OutsideShooting} | { Math.floor((player1Shots.outsideMakes / player1Shots.outsideShots) * 100) }</div>
          <div><span><strong>Indside Shooting:</strong></span> {player1.InsideShooting} | { Math.floor((player1Shots.insideMakes / player1Shots.insideShots) * 100) }</div>
          <div><span><strong>Defense:</strong></span> {player1.Defense}</div>
          <div><span><strong>Shooting Tendacy:</strong></span> {player1.ShootingTendancy}</div>
        </div>
        <div className="card">
          <h2>Player 2</h2>
          <div><span><strong>Outside Shooting:</strong></span> {player2.OutsideShooting} | { Math.floor((player2Shots.outsideMakes / player2Shots.outsideShots) * 100) }</div>
          <div><span><strong>Indside Shooting:</strong></span> {player2.InsideShooting} | { Math.floor((player2Shots.insideMakes / player2Shots.insideShots) * 100) }</div>
          <div><span><strong>Defense:</strong></span> {player2.Defense}</div>
          <div><span><strong>Shooting Tendacy:</strong></span> {player2.ShootingTendancy}</div>
        </div>
      </div>
      <div className="card">
        Player 1: {player1Score} | Player 2: {player2Score}
      </div>
      <div>{message}</div>
      <div className="card">
        <button onClick={playPossession}>
          Play Possession
        </button>
      </div>
    </>
  )
}

export default App
