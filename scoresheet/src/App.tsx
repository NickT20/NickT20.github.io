import { useState } from 'react'
import './App.css'
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { ApiPlayer, PersonResponse, Pitcher, PitcherStat, Player, Stat } from './types';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com';
const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

function buildMlbUrl(personId: string, range: string): string {
  switch (range) {
    case 'season':
      return `${MLB_BASE}/people/${personId}?hydrate=currentTeam,team,stats(type=season)`;
    case 'week': {
      const dr = `startDate=${moment().subtract(7, 'days').format('MM/DD/YYYY')},endDate=${moment().format('MM/DD/YYYY')}`;
      return `${MLB_BASE}/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,${dr})`;
    }
    case 'yesterday': {
      const d = moment().subtract(1, 'days').format('MM/DD/YYYY');
      return `${MLB_BASE}/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,startDate=${d},endDate=${d})`;
    }
    default: {
      const d = moment().format('MM/DD/YYYY');
      return `${MLB_BASE}/people/${personId}?hydrate=currentTeam,team,stats(type=byDateRange,startDate=${d},endDate=${d})`;
    }
  }
}

async function getHitterDataAsync(personId: string, range: string): Promise<Player> {
  const response = await fetch(buildMlbUrl(personId, range));
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats?.[0]?.splits?.[0]?.stat as Stat | undefined;
    const isMlb = personResponse.people[0].currentTeam.sport.id === 1;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName + (!isMlb ? '*' : ''),
      atBats: stat?.atBats,
      hits: stat?.hits,
      homeRuns: stat?.homeRuns,
      baseOnBalls: stat?.baseOnBalls,
      avg: stat?.avg,
      obp: stat?.obp,
      slg: stat?.slg,
      ops: stat?.ops,
      stolenBases: stat?.stolenBases,
      caughtStealing: stat?.caughtStealing,
    };
  }
  return Promise.reject();
}

async function getPitcherDataAsync(personId: string, range: string): Promise<Pitcher> {
  const response = await fetch(buildMlbUrl(personId, range));
  if (response.ok) {
    const personResponse: PersonResponse = await response.json();
    const stat = personResponse.people[0]?.stats?.[0]?.splits?.[0]?.stat as PitcherStat | undefined;
    const isMlb = personResponse.people[0].currentTeam.sport.id === 1;
    return {
      id: personId,
      position: personResponse.people[0].primaryPosition.abbreviation,
      name: personResponse.people[0].fullName + (!isMlb ? '*' : ''),
      gamesPlayed: stat?.gamesPlayed ? +stat.gamesPlayed : undefined,
      gamesStarted: stat?.gamesStarted ? +stat.gamesStarted : undefined,
      inningsPitched: stat?.inningsPitched,
      hits: stat?.hits,
      earnedRuns: stat?.earnedRuns,
      baseOnBalls: stat?.baseOnBalls,
      strikeOuts: stat?.strikeOuts,
      era: stat?.era,
      whip: stat?.whip,
    };
  }
  return Promise.reject();
}

const TEAMS: { label: string; id: number }[] = [
  { label: 'Nick', id: 1 },
  { label: 'Popps', id: 2 },
  { label: 'Ryan', id: 3 },
  { label: 'Chris', id: 4 },
];

function App() {
  const [players, setPlayers] = useState<Player[] | undefined>(undefined);
  const [pitchers, setPitchers] = useState<Pitcher[] | undefined>(undefined);
  const [playerTotals, setPlayerTotals] = useState<Player | undefined>(undefined);
  const [pitchersTotals, setPitcherTotals] = useState<Pitcher | undefined>(undefined);
  const [user, setUser] = useState<string>('Nick');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getTeamId = (name = user) => TEAMS.find(t => t.label === name)?.id ?? 1;

  const loadHitterData = async (userPlayers: ApiPlayer[], range: string): Promise<{ players: Player[]; totals: Player }> => {
    const results = await Promise.all(userPlayers.map(p => getHitterDataAsync(p.playerId, range)));

    const totals: Player = { id: '0', position: '', name: 'Total', atBats: 0, hits: 0, homeRuns: 0, baseOnBalls: 0, avg: 0, obp: 0, slg: 0, ops: 0, stolenBases: 0, caughtStealing: 0 };
    for (const h of results) {
      if (h.atBats) {
        totals.atBats! += h.atBats;
        totals.hits! += h.hits ?? 0;
        totals.homeRuns! += h.homeRuns ?? 0;
        totals.baseOnBalls! += h.baseOnBalls ?? 0;
        totals.stolenBases! += h.stolenBases ?? 0;
        totals.caughtStealing! += h.caughtStealing ?? 0;
      }
    }
    if (totals.atBats && totals.atBats > 0) {
      totals.avg = +(totals.hits! / totals.atBats).toFixed(3);
      totals.obp = +((totals.hits! + totals.baseOnBalls!) / totals.atBats).toFixed(3);
    }
    return { players: results, totals };
  };

  const loadPitcherData = async (userPlayers: ApiPlayer[], range: string): Promise<{ players: Pitcher[]; totals: Pitcher }> => {
    const results = await Promise.all(userPlayers.map(p => getPitcherDataAsync(p.playerId, range)));

    const totals: Pitcher = { id: '0', gamesPlayed: 0, gamesStarted: 0, baseOnBalls: 0, earnedRuns: 0, era: 0, hits: 0, inningsPitched: 0, name: 'Totals', position: 'P', strikeOuts: 0, whip: 0 };
    for (const p of results) {
      if (p.gamesPlayed) {
        totals.gamesPlayed! += p.gamesPlayed;
        totals.gamesStarted! += p.gamesStarted ?? 0;
        totals.baseOnBalls! += p.baseOnBalls ?? 0;
        totals.earnedRuns! += p.earnedRuns ?? 0;
        totals.hits! += p.hits ?? 0;
        totals.inningsPitched! += p.inningsPitched ? +p.inningsPitched : 0;
        totals.strikeOuts! += p.strikeOuts ?? 0;
      }
    }
    if (totals.inningsPitched && totals.inningsPitched > 0) {
      totals.era = +(totals.earnedRuns! / totals.inningsPitched! * 9).toFixed(2);
      totals.whip = +((totals.hits! + totals.baseOnBalls!) / totals.inningsPitched!).toFixed(2);
    }
    return { players: results, totals };
  };

  const loadData = async (range: string) => {
    setLoading(true);
    setPlayers(undefined);
    setPitchers(undefined);

    let apiPlayers: ApiPlayer[] = [];
    const response = await fetch(`${API_BASE}/players?teamId=${getTeamId()}`);
    if (response.ok) apiPlayers = await response.json();
    apiPlayers.sort((a, b) => a.order - b.order);

    const hitters = apiPlayers.filter(p => p.hitter);
    const pitcherPlayers = apiPlayers.filter(p => !p.hitter);

    const [hittersResult, pitchersResult] = await Promise.all([
      loadHitterData(hitters, range),
      loadPitcherData(pitcherPlayers, range),
    ]);

    setPlayers(hittersResult.players);
    setPlayerTotals(hittersResult.totals);
    setPitchers(pitchersResult.players);
    setPitcherTotals(pitchersResult.totals);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        Fantasy Baseball Scoresheet
      </Typography>

      <FormControl sx={{ mb: 1 }}>
        <FormLabel>Team</FormLabel>
        <RadioGroup row value={user} onChange={e => setUser(e.currentTarget.value)}>
          {TEAMS.map(t => (
            <FormControlLabel key={t.id} value={t.label} control={<Radio size="small" />} label={t.label} />
          ))}
        </RadioGroup>
      </FormControl>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {(['Season', 'Last 7 Days', 'Yesterday', 'Today'] as const).map((label, i) => {
          const range = ['season', 'week', 'yesterday', 'today'][i];
          return (
            <Button key={label} variant="contained" size="small" disabled={loading} onClick={() => loadData(range)}>
              {label}
            </Button>
          );
        })}
        <Button variant="outlined" size="small" onClick={() => navigate(`/config?teamId=${getTeamId()}`)}>
          Manage Roster
        </Button>
      </Stack>

      {loading && (
        <Stack alignItems="center" sx={{ py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>Loading stats…</Typography>
        </Stack>
      )}

      {!loading && players && (
        <>
          <Typography variant="h6" sx={{ mt: 1 }}>Hitters</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                  <TableCell>Pos</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">AB</TableCell>
                  <TableCell align="right">H</TableCell>
                  <TableCell align="right">HR</TableCell>
                  <TableCell align="right">BB</TableCell>
                  <TableCell align="right">AVG</TableCell>
                  <TableCell align="right">OBP</TableCell>
                  <TableCell align="right">SLG</TableCell>
                  <TableCell align="right">OPS</TableCell>
                  <TableCell align="right">SB</TableCell>
                  <TableCell align="right">CS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map(stat => (
                  <TableRow key={stat.id} hover>
                    <TableCell>{stat.position}</TableCell>
                    <TableCell>{stat.name}</TableCell>
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
                {playerTotals && (
                  <TableRow sx={{ '& td': { fontWeight: 700, borderTop: '2px solid rgba(224,224,224,1)' } }}>
                    <TableCell />
                    <TableCell>{playerTotals.name}</TableCell>
                    <TableCell align="right">{playerTotals.atBats}</TableCell>
                    <TableCell align="right">{playerTotals.hits}</TableCell>
                    <TableCell align="right">{playerTotals.homeRuns}</TableCell>
                    <TableCell align="right">{playerTotals.baseOnBalls}</TableCell>
                    <TableCell align="right">{playerTotals.avg}</TableCell>
                    <TableCell align="right">{playerTotals.obp}</TableCell>
                    <TableCell align="right" />
                    <TableCell align="right" />
                    <TableCell align="right">{playerTotals.stolenBases}</TableCell>
                    <TableCell align="right">{playerTotals.caughtStealing}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {!loading && pitchers && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>Pitchers</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700 } }}>
                  <TableCell>Pos</TableCell>
                  <TableCell>Name</TableCell>
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
                {pitchers.map(stat => (
                  <TableRow key={stat.id} hover>
                    <TableCell>{stat.position}</TableCell>
                    <TableCell>{stat.name}</TableCell>
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
                {pitchersTotals && (
                  <TableRow sx={{ '& td': { fontWeight: 700, borderTop: '2px solid rgba(224,224,224,1)' } }}>
                    <TableCell />
                    <TableCell>{pitchersTotals.name}</TableCell>
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
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default App;
