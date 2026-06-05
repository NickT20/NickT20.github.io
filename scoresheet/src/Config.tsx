import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ApiPlayer, PersonResponse } from './types';
import {
  Button, FormControl, FormControlLabel, FormLabel, IconButton, Radio,
  RadioGroup, Stack, TextField, Typography, Paper, Divider, CircularProgress,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_BASE = 'https://8kyrux6q4c.execute-api.us-east-1.amazonaws.com';
const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

const TEAMS = [
  { label: 'Nick', id: 1 },
  { label: 'Popps', id: 2 },
  { label: 'Ryan', id: 3 },
  { label: 'Chris', id: 4 },
];

interface ConfigPlayer extends ApiPlayer {
  name: string;
}

interface SortableRowProps {
  player: ConfigPlayer;
  onRemove: (playerId: string) => void;
}

function SortableRow({ player, onRemove }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.playerId });

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        gap: 1,
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'flex', color: '#aaa' }}>
        <DragIndicatorIcon fontSize="small" />
      </span>
      <Typography sx={{ flex: 1 }}>{player.name}</Typography>
      <Typography variant="caption" color="text.secondary">{player.playerId}</Typography>
      <IconButton size="small" onClick={() => onRemove(player.playerId)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}

function Config() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTeamId = parseInt(searchParams.get('teamId') ?? '1', 10);
  const initialTeam = TEAMS.find(t => t.id === initialTeamId) ?? TEAMS[0];

  const [selectedTeam, setSelectedTeam] = useState(initialTeam);
  const [hitters, setHitters] = useState<ConfigPlayer[]>([]);
  const [pitchers, setPitchers] = useState<ConfigPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newPlayerId, setNewPlayerId] = useState('');
  const [newPlayerType, setNewPlayerType] = useState<'hitter' | 'pitcher'>('hitter');

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchRoster = async (teamId: number) => {
    setLoading(true);
    setHitters([]);
    setPitchers([]);

    const res = await fetch(`${API_BASE}/players?teamId=${teamId}`);
    if (!res.ok) { setLoading(false); return; }
    const json: ApiPlayer[] = await res.json();
    json.sort((a, b) => a.order - b.order);

    const namePromises = json.map(p =>
      fetch(`${MLB_BASE}/people/${p.playerId}`)
        .then(r => r.json() as Promise<PersonResponse>)
        .then(data => ({ ...p, name: data.people[0]?.fullName ?? p.playerId }))
        .catch(() => ({ ...p, name: p.playerId }))
    );
    const withNames = await Promise.all(namePromises);

    setHitters(withNames.filter(p => p.hitter));
    setPitchers(withNames.filter(p => !p.hitter));
    setLoading(false);
  };

  useEffect(() => {
    fetchRoster(selectedTeam.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam.id]);

  const handleTeamChange = (label: string) => {
    const team = TEAMS.find(t => t.label === label) ?? TEAMS[0];
    setSelectedTeam(team);
  };

  const handleDragEnd = (event: DragEndEvent, list: ConfigPlayer[], setList: (l: ConfigPlayer[]) => void) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = list.findIndex(p => p.playerId === active.id);
      const newIndex = list.findIndex(p => p.playerId === over.id);
      setList(arrayMove(list, oldIndex, newIndex));
    }
  };

  const handleRemove = (playerId: string, isHitter: boolean) => {
    if (isHitter) setHitters(h => h.filter(p => p.playerId !== playerId));
    else setPitchers(p => p.filter(p => p.playerId !== playerId));
  };

  const handleAddPlayer = () => {
    const id = newPlayerId.trim();
    if (!id) return;

    const allPlayers = [...hitters, ...pitchers];
    if (allPlayers.some(p => p.playerId === id)) {
      setNewPlayerId('');
      return;
    }

    const newPlayer: ConfigPlayer = {
      playerId: id,
      teamId: selectedTeam.id,
      hitter: newPlayerType === 'hitter',
      farm: false,
      starter: false,
      order: 0,
      name: id,
    };

    if (newPlayerType === 'hitter') setHitters(h => [...h, newPlayer]);
    else setPitchers(p => [...p, newPlayer]);
    setNewPlayerId('');
  };

  const handleSave = async () => {
    setSaving(true);

    const reordered: ApiPlayer[] = [
      ...hitters.map((p, i) => ({ playerId: p.playerId, teamId: selectedTeam.id, hitter: true, farm: false, starter: false, order: i + 1 })),
      ...pitchers.map((p, i) => ({ playerId: p.playerId, teamId: selectedTeam.id, hitter: false, farm: false, starter: false, order: i + 1 })),
    ];

    const batch = [...reordered];
    while (batch.length > 0) {
      await fetch(`${API_BASE}/players`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch.splice(0, 25)),
      });
    }

    setSaving(false);
    navigate('/');
  };

  const hasPl = hitters.length > 0 || pitchers.length > 0;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" size="small" onClick={() => navigate('/')}>← Home</Button>
        {hasPl && (
          <Button variant="contained" size="small" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save Roster'}
          </Button>
        )}
      </Stack>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Manage Roster</Typography>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Team</FormLabel>
        <RadioGroup row value={selectedTeam.label} onChange={e => handleTeamChange(e.target.value)}>
          {TEAMS.map(t => (
            <FormControlLabel key={t.id} value={t.label} control={<Radio size="small" />} label={t.label} />
          ))}
        </RadioGroup>
      </FormControl>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Add Player</Typography>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            label="MLB Player ID"
            value={newPlayerId}
            onChange={e => setNewPlayerId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
            sx={{ width: 160 }}
          />
          <RadioGroup row value={newPlayerType} onChange={e => setNewPlayerType(e.target.value as 'hitter' | 'pitcher')}>
            <FormControlLabel value="hitter" control={<Radio size="small" />} label="Hitter" />
            <FormControlLabel value="pitcher" control={<Radio size="small" />} label="Pitcher" />
          </RadioGroup>
          <Button variant="contained" size="small" onClick={handleAddPlayer} disabled={!newPlayerId.trim()}>
            Add
          </Button>
        </Stack>
      </Paper>

      {loading && (
        <Stack alignItems="center" sx={{ py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>Loading roster…</Typography>
        </Stack>
      )}

      {!loading && (
        <>
          <Typography variant="h6">Hitters</Typography>
          <Typography variant="caption" color="text.secondary">Drag to reorder</Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, hitters, setHitters)}>
            <SortableContext items={hitters.map(p => p.playerId)} strategy={verticalListSortingStrategy}>
              <Stack spacing={0.5} sx={{ mt: 1, mb: 3 }}>
                {hitters.length === 0 && <Typography variant="body2" color="text.secondary">No hitters</Typography>}
                {hitters.map(p => (
                  <SortableRow key={p.playerId} player={p} onRemove={id => handleRemove(id, true)} />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="h6">Pitchers</Typography>
          <Typography variant="caption" color="text.secondary">Drag to reorder</Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, pitchers, setPitchers)}>
            <SortableContext items={pitchers.map(p => p.playerId)} strategy={verticalListSortingStrategy}>
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {pitchers.length === 0 && <Typography variant="body2" color="text.secondary">No pitchers</Typography>}
                {pitchers.map(p => (
                  <SortableRow key={p.playerId} player={p} onRemove={id => handleRemove(id, false)} />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

export default Config;
