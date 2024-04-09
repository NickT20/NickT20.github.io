import { useState } from 'react'
import './App.css'
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';

interface Player {
  id: number;
  position: string;
  name: string;
  atBats: number;
  hits: number;
  homeRuns: number;
  baseOnBalls: number;
  avg: number;
  obp?: number;
  slg?: number;
  ops?: number;
  stolenBases: number;
  caughtStealing: number;
}

interface Pitcher {
  id: number;
  position?: string;
  name?: string;
  gamesPlayed?: number;
  gamesStarted?: number;
  inningsPitched?: number;
  hits?: number;
  earnedRuns?: number;
  baseOnBalls?: number;
  strikeOuts?: number;
  era?: number;
  whip?: number;
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
  let url = "";
  switch (range) {
    case "season":
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=season)`;
      break;
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
  }
  const response = await fetch(url);
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
  let url = "";
  switch (range) {
    case "season":
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=season)`;
      break;
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=stats(type=byDateRange,${dateRange})`;
      break;
  }
  const response = await fetch(url);
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats[0]?.splits[0]?.stat as PitcherStat;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName,
      gamesPlayed: stat?.gamesPlayed ? +stat.gamesPlayed : undefined,
      gamesStarted: stat?.gamesStarted ? +stat.gamesStarted : undefined,
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
  const [playerTotals, setPlayerTotals] = useState<Player | undefined>(undefined);
  const [pitchersTotals, setPitcherTotals] = useState<Pitcher | undefined>(undefined);
  const [user, setUser] = useState<string>("Nick");

  const loadHitterData = async (range: string) => {
    let userPlayers: number[] = [];
    if (user === 'Nick') {
      userPlayers = nickHitters;
    } else if (user === 'Popps') {
      userPlayers = poppsHitters;
    } else  {
      userPlayers = ryanHitters;
    }

    const players = [];

    const playerTotal: Player = {
      id: 0,
      position: "",
      name: "Total",
      atBats: 0,
      hits: 0,
      homeRuns: 0,
      baseOnBalls: 0,
      avg: 0,
      obp: 0,
      slg: 0,
      ops: 0,
      stolenBases: 0,
      caughtStealing: 0
    };

    for (const userPlayer of userPlayers) {
      const hitter = await getHitterDataAsync(userPlayer, range)
      players.push(hitter);
      if (hitter.atBats) {
        playerTotal.atBats! += hitter.atBats;
        playerTotal.hits! += hitter.hits;
        playerTotal.homeRuns! += hitter.homeRuns;
        playerTotal.baseOnBalls! += hitter.baseOnBalls;
        playerTotal.stolenBases! += hitter.stolenBases;
        playerTotal.caughtStealing! += hitter.caughtStealing;
      }
    }

    if (playerTotal.atBats && playerTotal.atBats > 0) {
      playerTotal.avg = +(playerTotal.hits / playerTotal.atBats).toFixed(3);
      playerTotal.obp = +((playerTotal.hits + playerTotal.baseOnBalls) / playerTotal.atBats).toFixed(3);
    }

    setPlayerTotals(playerTotal);
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

    const playerTotal: Pitcher = {
      id: 0,
      gamesPlayed: 0,
      gamesStarted: 0,
      baseOnBalls: 0,
      earnedRuns: 0,
      era: 0,
      hits: 0,
      inningsPitched: 0,
      name: "Totals",
      position: "P",
      strikeOuts: 0,
      whip: 0
    };

    for (const userPlayer of userPlayers) {
      const pitcher = await getPitcherDataAsync(userPlayer, range)
      players.push(pitcher);
      if (pitcher.gamesPlayed) {
        playerTotal.gamesPlayed! += pitcher.gamesPlayed;
        playerTotal.gamesStarted! += pitcher.gamesStarted ?? 0;
        playerTotal.baseOnBalls! += pitcher.baseOnBalls ?? 0;
        playerTotal.earnedRuns! += pitcher.earnedRuns ?? 0;
        playerTotal.hits! += pitcher.hits ?? 0;
        playerTotal.inningsPitched! += pitcher.inningsPitched ? +pitcher.inningsPitched : 0;
        playerTotal.strikeOuts! += pitcher.strikeOuts ?? 0;
      }
    }

    if (playerTotal.inningsPitched && playerTotal.inningsPitched > 0) {
      playerTotal.era = +(playerTotal.earnedRuns! / playerTotal.inningsPitched! * 9).toFixed(2);
      playerTotal.whip = +((playerTotal.hits! + playerTotal.baseOnBalls!) / playerTotal.inningsPitched!).toFixed(2);
    }
    setPitcherTotals(playerTotal);

    setPitchers(players);
  }

  const onOptionChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUser(event.currentTarget.value);
  };

  return (
    <>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Team:</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={user}
          name="radio-buttons-group"
          onChange={onOptionChangeHandler}
        >
          <FormControlLabel value="Nick" control={<Radio />} label="Nick" />
          <FormControlLabel value="Popps" control={<Radio />} label="Popps" />
          <FormControlLabel value="Ryan" control={<Radio />} label="Ryan" />
        </RadioGroup>
      </FormControl>
      <hr />
      <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => {
              loadPitcherData("season");
              loadHitterData("season");
            }}>
            Season
          </Button>
          <Button variant="contained" onClick={() => {
              loadPitcherData("week");
              loadHitterData("week");
            }}>
            Last 7 Days
          </Button>
          <Button variant="contained" onClick={() => {
              loadPitcherData("yesterday");
              loadHitterData("yesterday");
            }}>
            Yesterday
          </Button>
          <Button variant="contained" onClick={() => {
              loadPitcherData("today");
              loadHitterData("today");
            }}>
            Today
          </Button>
      </Stack>
      <h2>Hitters</h2>
      { players && 
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="right">AB</TableCell>
                <TableCell align="right">H</TableCell>
                <TableCell align="right">HR</TableCell>
                <TableCell align="right">BB</TableCell>
                <TableCell align="right">BA</TableCell>
                <TableCell align="right">OBA</TableCell>
                <TableCell align="right">SlgA</TableCell>
                <TableCell align="right">OPS</TableCell>
                <TableCell align="right">SB</TableCell>
                <TableCell align="right">CS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { players?.map(stat => (
                <TableRow
                  key={stat.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="left">{stat.position}</TableCell>
                  <TableCell align="left">{stat.name}</TableCell>
                  <TableCell align="right">{stat.atBats}</TableCell>
                  <TableCell align="right">{stat.hits}</TableCell>
                  <TableCell align="right">{stat.homeRuns}</TableCell>
                  <TableCell align="right">{stat.baseOnBalls}</TableCell>
                  <TableCell align="right">{stat.avg}</TableCell>
                  <TableCell align="right">{stat.obp}</TableCell>
                  <TableCell align="right">{stat.slg}</TableCell>
                  <TableCell align="right">{stat.ops}</TableCell>
                  <TableCell align="right">{stat.stolenBases}</TableCell>
                  <TableCell align="right">{stat.caughtStealing}</TableCell>
                </TableRow>
            ))}
            { playerTotals &&
              <TableRow
                key={playerTotals.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="left"></TableCell>
                <TableCell align="left">{playerTotals.name}</TableCell>
                <TableCell align="right">{playerTotals.atBats}</TableCell>
                <TableCell align="right">{playerTotals.hits}</TableCell>
                <TableCell align="right">{playerTotals.homeRuns}</TableCell>
                <TableCell align="right">{playerTotals.baseOnBalls}</TableCell>
                <TableCell align="right">{playerTotals.avg}</TableCell>
                <TableCell align="right">{playerTotals.obp}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{playerTotals.stolenBases}</TableCell>
                <TableCell align="right">{playerTotals.caughtStealing}</TableCell>
              </TableRow>
            }
            </TableBody>
          </Table>
        </TableContainer>
      }
      <hr />
      <h2>Pitchers</h2>
      { pitchers && 
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="right">G</TableCell>
                <TableCell align="right">GS</TableCell>
                <TableCell align="right">IP</TableCell>
                <TableCell align="right">H</TableCell>
                <TableCell align="right">ER</TableCell>
                <TableCell align="right">BB</TableCell>
                <TableCell align="right">K</TableCell>
                <TableCell align="right">ERA</TableCell>
                <TableCell align="right">WHIP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { pitchers?.map(stat => (
                <TableRow
                  key={stat.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="left">{stat.position}</TableCell>
                  <TableCell align="left">{stat.name}</TableCell>
                  <TableCell align="right">{stat.gamesPlayed}</TableCell>
                  <TableCell align="right">{stat.gamesStarted}</TableCell>
                  <TableCell align="right">{stat.inningsPitched}</TableCell>
                  <TableCell align="right">{stat.hits}</TableCell>
                  <TableCell align="right">{stat.earnedRuns}</TableCell>
                  <TableCell align="right">{stat.baseOnBalls}</TableCell>
                  <TableCell align="right">{stat.strikeOuts}</TableCell>
                  <TableCell align="right">{stat.era}</TableCell>
                  <TableCell align="right">{stat.whip}</TableCell>
                </TableRow>
              ))}
              { pitchersTotals &&
                <TableRow
                  key={pitchersTotals.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="left"></TableCell>
                  <TableCell align="left">{pitchersTotals.name}</TableCell>
                  <TableCell align="right">{pitchersTotals.gamesPlayed}</TableCell>
                  <TableCell align="right">{pitchersTotals.gamesStarted}</TableCell>
                  <TableCell align="right">{pitchersTotals.inningsPitched?.toFixed(1)}</TableCell>
                  <TableCell align="right">{pitchersTotals.hits}</TableCell>
                  <TableCell align="right">{pitchersTotals.earnedRuns}</TableCell>
                  <TableCell align="right">{pitchersTotals.baseOnBalls}</TableCell>
                  <TableCell align="right">{pitchersTotals.strikeOuts}</TableCell>
                  <TableCell align="right">{pitchersTotals.era}</TableCell>
                  <TableCell align="right">{pitchersTotals.whip}</TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
    }
    </>
  )
}

export default App
