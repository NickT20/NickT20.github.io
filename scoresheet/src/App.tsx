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

const ryanPitchers = [
  668678,
  592866,
  619242,
  615698,
  694297,
  660853,
  608371,
  628452,
  548384,
  554431,
  673513
]

const ryanHitters = [
  575929,
  656555,
  605141,
  676395,
  600869,
  663611,
  596019,
  682928,
  592885,
  676475,
  666181,
  686217,
  679032,
  657088,
  694192
]

const poppsPitchers = [
  663623,
  607192,
  640455,
  548389,
  676775,
  663855,
  640451,
  642397,
  656546,
  552640,
  621242,
  593576
]

const poppsHitters = [
  553869,
  672275,
  607732,
  547180,
  663538,
  641857,
  669707,
  673490,
  621035,
  666149,
  641313,
  664056,
  641355,
  624585
]

const nickPitchers = [
  675911,
  676272,
  518876,
  506433,
  572020,
  666745,
  621381,
  666277,
  663362,
  664854,
  643511,
  681911,
  657240,
  547973,
  663432,
]

const nickHitters = [
  672515,
  542194,
  624413,
  608841,
  663898,
  676701,
  669394,
  605204,
  642731,
  666134,
  665862,
  686668,
  641584,
  666971,
]

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
  const [user, setUser] = useState<string>("Nick");

  const loadData = async (range: string) => {
    let userPlayers: number[] = [];
    if (user === 'Nick') {
      userPlayers = nickHitters;
    } else if (user === 'Popps') {
      userPlayers = poppsHitters;
    } else  {
      userPlayers = ryanHitters;
    }

    const players = [];

    for (const userPlayer of userPlayers) {
      players.push(await getHitterDataAsync(userPlayer, range));
    }
    setPlayers(players);
  }

  const loadPitcherData = async (range: string) => {
    let userPlayers: number[] = [];
    if (user === 'Nick') {
      userPlayers = nickPitchers;
    } else if (user === 'Popps') {
      userPlayers = poppsPitchers;
    } else  {
      userPlayers = ryanPitchers;
    }

    const players: Pitcher[] = [];

    for (const userPlayer of userPlayers) {
      players.push(await getPitcherDataAsync(userPlayer, range));
    }

    setPitchers(players);
  }

  const onOptionChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setUser(event.currentTarget.value);
  };

  return (
    <>
      <select onChange={onOptionChangeHandler}>
        <option>Please choose one option</option>
          <option key="nick">Nick</option>
          <option key="ryan">Ryan</option>
          <option key="popps">Popps</option>
      </select>
      <h2>Hitters</h2>
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
      { players && <p className="read-the-docs">
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
      </p>}
      <hr />
      <h2>Pitchers</h2>
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
      { pitchers && <p className="read-the-docs">
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
          { pitchers.map(stat => {
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
    }
    </>
  )
}

export default App
