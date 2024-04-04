import { useState } from 'react'
import './App.css'
import moment from 'moment';

interface Player {
  id: number;
  position: string;
  name: string;
  atBats: number;
  hits: number;
  homeRuns: number;
  baseOnBalls: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  stolenBases: number;
  caughtStealing: number;
}

interface Pitcher {
  id: number;
  position: string;
  name: string;
  gamesPlayed: string;
  gamesStarted: string;
  inningsPitched: number;
  hits: number;
  earnedRuns: number;
  baseOnBalls: number;
  strikeOuts: number;
  era: number;
  whip: number;
}

interface PrimaryPosition {
  abbreviation: string;
}

interface PitcherStat {
  gamesPlayed: string;
  gamesStarted: string;
  inningsPitched: number;
  hits: number;
  earnedRuns: number;
  baseOnBalls: number;
  strikeOuts: number;
  era: number;
  whip: number;
}

interface Stat {
  atBats: number;
  hits: number;
  homeRuns: number;
  baseOnBalls: number;
  avg: number;
  obp: number;
  slg: number;
  ops: number;
  stolenBases: number;
  caughtStealing: number;
}

interface Splits {
  stat: Stat | PitcherStat;
}

interface Stats {
  splits: Splits[];
}

interface People {
  stats: Stats[];
  fullName: string;
  primaryPosition: PrimaryPosition;
}

interface PersonResponse {
  people: People[];
}

async function getHitterDataAsync(personId: number, range: string): Promise<Player> {
  let dateRange = "";
  switch (range) {
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      break;
  }
  const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`);
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats[0]?.splits[0]?.stat as Stat;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName,
      atBats: stat?.atBats,
      hits: stat?.hits,
      homeRuns: stat?.homeRuns,
      baseOnBalls: stat?.baseOnBalls,
      avg: stat?.avg,
      obp: stat?.obp,
      slg: stat?.slg,
      ops: stat?.ops,
      stolenBases: stat?.stolenBases,
      caughtStealing: stat?.caughtStealing
    };
  }

  return Promise.reject();
}

async function getPitcherDataAsync(personId: number, range: string): Promise<Pitcher> {
  let dateRange = "";
  switch (range) {
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      break;
  }
  const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`);
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats[0]?.splits[0]?.stat as PitcherStat;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName,
      gamesPlayed: stat?.gamesPlayed,
      gamesStarted: stat?.gamesStarted,
      inningsPitched: stat?.inningsPitched,
      hits: stat?.hits,
      earnedRuns: stat?.earnedRuns,
      baseOnBalls: stat?.baseOnBalls,
      strikeOuts: stat?.strikeOuts,
      era: stat?.era,
      whip: stat?.whip
    };
  }

  return Promise.reject();
}

function App() {
  const [players, setPlayers] = useState<Player[] | undefined>(undefined);
  const [pitchers, setPitchers] = useState<Pitcher[] | undefined>(undefined);

  const loadData = async (range: string) => {
    const players = [];
    players.push(await getHitterDataAsync(672515, range));
    players.push(await getHitterDataAsync(542194, range));
    players.push(await getHitterDataAsync(624413, range));
    players.push(await getHitterDataAsync(608841, range));
    players.push(await getHitterDataAsync(663898, range));
    players.push(await getHitterDataAsync(676701, range));
    players.push(await getHitterDataAsync(669394, range));
    players.push(await getHitterDataAsync(605204, range));
    players.push(await getHitterDataAsync(642731, range));
    players.push(await getHitterDataAsync(666134, range));
    players.push(await getHitterDataAsync(665862, range));
    players.push(await getHitterDataAsync(686668, range));
    players.push(await getHitterDataAsync(641584, range));
    players.push(await getHitterDataAsync(666971, range));
    setPlayers(players);
  }

  const loadPitcherData = async (range: string) => {
    const players = [];
    players.push(await getPitcherDataAsync(675911, range));
    players.push(await getPitcherDataAsync(676272, range));
    players.push(await getPitcherDataAsync(518876, range));
    players.push(await getPitcherDataAsync(506433, range));
    players.push(await getPitcherDataAsync(572020, range));
    players.push(await getPitcherDataAsync(666745, range));
    players.push(await getPitcherDataAsync(621381, range));
    players.push(await getPitcherDataAsync(666277, range));
    players.push(await getPitcherDataAsync(663362, range));
    players.push(await getPitcherDataAsync(664854, range));
    players.push(await getPitcherDataAsync(643511, range));
    players.push(await getPitcherDataAsync(681911, range));
    players.push(await getPitcherDataAsync(657240, range));
    players.push(await getPitcherDataAsync(547973, range));
    players.push(await getPitcherDataAsync(663432, range));
    setPitchers(players);
  }

  return (
    <>
      <div className="card">
        <button onClick={() => loadData("week")}>
          Get stats for the last week
        </button>
        <button onClick={() => loadData("yesterday")}>
          Get stats for yesterday
        </button>
        <button onClick={() => loadData("today")}>
          Get stats for today
        </button>
      </div>
      <p className="read-the-docs">
        <table>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>AB</th>
            <th>H</th>
            <th>HR</th>
            <th>BB</th>
            <th>BA</th>
            <th>OBA</th>
            <th>SlgA</th>
            <th>OPS</th>
            <th>SB</th>
            <th>CS</th>
          </tr>
          { players?.map(stat => {
            return (
              <tr key={stat.id}>
                <td>{stat.position}</td>
                <td>{stat.name}</td>
                <td>{stat.atBats}</td>
                <td>{stat.hits}</td>
                <td>{stat.homeRuns}</td>
                <td>{stat.baseOnBalls}</td>
                <td>{stat.avg}</td>
                <td>{stat.obp}</td>
                <td>{stat.slg}</td>
                <td>{stat.ops}</td>
                <td>{stat.stolenBases}</td>
                <td>{stat.caughtStealing}</td>
              </tr>
            )
          })}
        </table>
      </p>
      <hr />
      <div className="card">
        <button onClick={() => loadPitcherData("week")}>
          Get stats for the last week
        </button>
        <button onClick={() => loadPitcherData("yesterday")}>
          Get stats for yesterday
        </button>
        <button onClick={() => loadPitcherData("today")}>
          Get stats for today
        </button>
      </div>
      <p className="read-the-docs">
        <table>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>G</th>
            <th>GS</th>
            <th>IP</th>
            <th>H</th>
            <th>ER</th>
            <th>BB</th>
            <th>K</th>
            <th>ERA</th>
            <th>WHIP</th>
          </tr>
          { pitchers?.map(stat => {
            return (
              <tr key={stat.id}>
                <td>{stat.position}</td>
                <td>{stat.name}</td>
                <td>{stat.gamesPlayed}</td>
                <td>{stat.gamesStarted}</td>
                <td>{stat.inningsPitched}</td>
                <td>{stat.hits}</td>
                <td>{stat.earnedRuns}</td>
                <td>{stat.baseOnBalls}</td>
                <td>{stat.strikeOuts}</td>
                <td>{stat.era}</td>
                <td>{stat.whip}</td>
              </tr>
            )
          })}
        </table>
      </p>
    </>
  )
}

export default App
