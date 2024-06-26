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
import { ApiPlayer, PersonResponse, Pitcher, PitcherStat, Player, Stat } from './types';
import { useNavigate } from 'react-router-dom';

async function getHitterDataAsync(personId: string, range: string): Promise<Player> {
  let dateRange = "";
  let url = "";
  switch (range) {
    case "season":
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=season)`;
      break;
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
  }
  const response = await fetch(url);

  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats ? personResponse.people[0]?.stats[0]?.splits[0]?.stat as Stat : undefined;
    const isMlb = personResponse.people[0].currentTeam.sport.id === 1;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName + (!isMlb ? "*" : "" ),
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

async function getPitcherDataAsync(personId: string, range: string): Promise<Pitcher> {
  let dateRange = "";
  let url = "";
  switch (range) {
    case "season":
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=season)`;
      break;
    case "week":
      dateRange = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
    case "yesterday":
      dateRange = `startDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')},endDate=${moment().subtract(1, 'days').format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
    default:
      dateRange = `startDate=${moment().format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      url = `https://statsapi.mlb.com/api/v1/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dateRange})`;
      break;
  }
  const response = await fetch(url);
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats ? personResponse.people[0]?.stats[0]?.splits[0]?.stat as PitcherStat : undefined;
    const isMlb = personResponse.people[0].currentTeam.sport.id === 1;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName + (!isMlb ? "*" : "" ),
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
  const navigate = useNavigate(); 

  const loadHitterData = async (userPlayers: ApiPlayer[], range: string) => {

    const players = [];
    const playerTotal: Player = {
      id: '0',
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
      const hitter = await getHitterDataAsync(userPlayer.playerId, range)
      players.push(hitter);
      if (hitter.atBats) {
        playerTotal.atBats! += hitter.atBats;
        playerTotal.hits! += hitter.hits ?? 0;
        playerTotal.homeRuns! += hitter.homeRuns ?? 0;
        playerTotal.baseOnBalls! += hitter.baseOnBalls ?? 0;
        playerTotal.stolenBases! += hitter.stolenBases ?? 0;
        playerTotal.caughtStealing! += hitter.caughtStealing ?? 0;
      }
    }

    if (playerTotal.atBats && playerTotal.atBats > 0) {
      playerTotal.avg = +(playerTotal.hits! / playerTotal.atBats).toFixed(3);
      playerTotal.obp = +((playerTotal.hits! + playerTotal.baseOnBalls!) / playerTotal.atBats).toFixed(3);
    }

    setPlayerTotals(playerTotal);
    setPlayers(players);
  }

  const loadPitcherData = async (userPlayers: ApiPlayer[], range: string) => {
    const players: Pitcher[] = [];

    const playerTotal: Pitcher = {
      id: '0',
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
      const pitcher = await getPitcherDataAsync(userPlayer.playerId, range)
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

  const getTeamId = () => {
    switch(user) {
      case 'Nick':
        return 1;
      case 'Popps': 
        return 2;
      default:
        return 3;
    }
  }

  const loadData = async (range: string) => {
    let players: ApiPlayer[] = [];
    const response = await fetch(`https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com/players?teamId=${getTeamId()}`);
    if (response.ok) {
      players = await response.json();
    }

    players.sort((a, b) => a.order - b.order);
    loadHitterData(players.filter(p => p.hitter), range);
    loadPitcherData(players.filter(p => !p.hitter), range);
  }

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
              loadData("season");
            }}>
            Season
          </Button>
          <Button variant="contained" onClick={() => {
              loadData("week");
            }}>
            Last 7 Days
          </Button>
          <Button variant="contained" onClick={() => {
              loadData("yesterday");
            }}>
            Yesterday
          </Button>
          <Button variant="contained" onClick={() => {
              loadData("today");
            }}>
            Today
          </Button>
          <Button variant="contained" onClick={() => { 
            navigate(`/config?teamId=${getTeamId()}`);
          }}>
            Config
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
