import type { GameStatus as GameStatusType, Color, TimeControl, BoardTheme, PieceSymbol, CapturedPieces } from '../engine/types'
import { TIME_CONTROL_OPTIONS, timeControlId, BOARD_THEMES } from '../engine/types'

type Props = {
  status: GameStatusType
  turn: Color
  playerColor: Color
  username: string
  difficulty: number
  onDifficultyChange: (d: number) => void
  onNewGame: () => void
  timeControl: TimeControl | null
  whiteMs: number | null
  blackMs: number | null
  clockStarted: boolean
  onTimeControlChange: (tc: TimeControl | null) => void
  boardTheme: BoardTheme
  onBoardThemeChange: (t: BoardTheme) => void
  capturedPieces: CapturedPieces
}

function formatClock(ms: number): string {
  if (ms < 10_000) {
    return `0:0${(ms / 1000).toFixed(1)}`
  }
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const PIECE_SYMBOLS: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}

function CapturedBar({ pieces, pieceColor }: { pieces: PieceSymbol[]; pieceColor: Color }) {
  if (pieces.length === 0) return null
  return (
    <div className="captured-bar">
      {pieces.map((p, i) => (
        <span key={i} className="captured-piece">
          {PIECE_SYMBOLS[pieceColor][p]}
        </span>
      ))}
    </div>
  )
}

export function GameStatus({
  status,
  turn,
  playerColor,
  username,
  difficulty,
  onDifficultyChange,
  onNewGame,
  timeControl,
  whiteMs,
  blackMs,
  clockStarted,
  onTimeControlChange,
  boardTheme,
  onBoardThemeChange,
  capturedPieces,
}: Props) {
  const isGameOver =
    status === 'checkmate' || status === 'stalemate' || status === 'draw' || status === 'timeout'

  const resultText =
    status === 'checkmate'
      ? turn === playerColor
        ? 'Stockfish wins by checkmate'
        : 'You win by checkmate!'
      : status === 'timeout'
        ? turn === playerColor
          ? 'You ran out of time'
          : 'Stockfish flagged — you win on time!'
        : 'Game drawn'

  const clockActive = (color: Color) =>
    timeControl !== null && clockStarted && !isGameOver && turn === color

  const renderClock = (ms: number | null, color: Color) => {
    if (ms === null) return null
    const classes = [
      'clock',
      clockActive(color) ? 'clock-active' : '',
      ms <= 20_000 ? 'clock-low' : '',
    ]
      .filter(Boolean)
      .join(' ')
    return <span className={classes}>{formatClock(ms)}</span>
  }

  const stockfishName = 'Stockfish'
  const playerName = username || 'You'

  return (
    <div className="panel">
      <h3 className="panel-title">Players</h3>

      {/* Black player card */}
      <div className="player-card">
        <span className="player-avatar player-avatar-b">♚</span>
        <div className="player-meta">
          <span className="player-name">{playerColor === 'b' ? playerName : stockfishName}</span>
          <span className="player-rating">
            {playerColor !== 'b' ? `Elo ~${difficultyToElo(difficulty)}` : ''}
          </span>
          <CapturedBar
            pieces={capturedPieces.byBlack}
            pieceColor="w"
          />
        </div>
        {renderClock(blackMs, 'b')}
      </div>

      {/* White player card */}
      <div className="player-card">
        <span className="player-avatar player-avatar-w">♔</span>
        <div className="player-meta">
          <span className="player-name">{playerColor === 'w' ? playerName : stockfishName}</span>
          <span className="player-rating">
            {playerColor !== 'w' ? `Elo ~${difficultyToElo(difficulty)}` : ''}
          </span>
          <CapturedBar
            pieces={capturedPieces.byWhite}
            pieceColor="b"
          />
        </div>
        {renderClock(whiteMs, 'w')}
      </div>

      <div className="time-control">
        <label className="control-label">Time control</label>
        <select
          className="time-select"
          value={timeControlId(timeControl)}
          onChange={(e) => {
            const opt = TIME_CONTROL_OPTIONS.find((o) => o.id === e.target.value)
            onTimeControlChange(opt?.tc ?? null)
          }}
        >
          {TIME_CONTROL_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="control-hint">Changing time restarts the game</p>
      </div>

      <div className="theme-control">
        <label className="control-label">Board theme</label>
        <div className="theme-swatches">
          {BOARD_THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-swatch ${boardTheme === t.id ? 'theme-swatch-active' : ''} ${t.id === 'shrek' ? 'theme-swatch-shrek' : ''}`}
              title={t.label}
              aria-label={`${t.label} board theme`}
              onClick={() => onBoardThemeChange(t.id)}
              style={
                t.id === 'shrek'
                  ? undefined
                  : { background: `linear-gradient(135deg, ${t.preview[0]} 50%, ${t.preview[1]} 50%)` }
              }
            />
          ))}
        </div>
        <p className="control-hint">
          {BOARD_THEMES.find((t) => t.id === boardTheme)?.label}
        </p>
      </div>

      <div className="difficulty-control">
        <label className="control-label">
          Strength <strong>Elo ~{difficultyToElo(difficulty)}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="difficulty-slider"
        />
        <div className="difficulty-labels">
          <span>Casual</span>
          <span>Master</span>
        </div>
      </div>

      {isGameOver && (
        <div className="game-over-banner">
          <p>{resultText}</p>
          <button className="btn btn-primary" onClick={onNewGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

function difficultyToElo(d: number): number {
  return Math.round(400 + (d - 1) * (2400 / 19))
}
