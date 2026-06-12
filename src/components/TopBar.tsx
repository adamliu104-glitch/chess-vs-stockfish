import type { GameStatus as GameStatusType, Color } from '../engine/types'

type Props = {
  status: GameStatusType
  turn: Color
  isThinking: boolean
  paused: boolean
  clockStarted: boolean
  onNewGame: () => void
  onFlipBoard: () => void
  onTogglePause: () => void
}

const STATUS_MESSAGES: Record<GameStatusType, (turn: Color) => string> = {
  playing: (turn) => `${turn === 'w' ? 'White' : 'Black'} to move`,
  check: (turn) => `${turn === 'w' ? 'White' : 'Black'} is in check`,
  checkmate: (turn) => `Checkmate — ${turn === 'w' ? 'Black' : 'White'} wins`,
  stalemate: () => 'Stalemate — Draw',
  draw: () => 'Draw',
  timeout: (turn) => `${turn === 'w' ? 'White' : 'Black'} flagged — ${turn === 'w' ? 'Black' : 'White'} wins on time`,
}

const isOver = (status: GameStatusType) =>
  status === 'checkmate' || status === 'stalemate' || status === 'draw' || status === 'timeout'

export function TopBar({ status, turn, isThinking, paused, clockStarted, onNewGame, onFlipBoard, onTogglePause }: Props) {
  const gameOver = isOver(status)
  const canPause = clockStarted && !gameOver

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">♞</span>
        <div className="brand-text">
          <h1 className="brand-title">Chess</h1>
          <span className="brand-sub">vs Stockfish 18</span>
        </div>
      </div>

      <div className={`topbar-status status-${status} ${paused ? 'status-paused' : ''}`}>
        {paused ? (
          <span className="paused-indicator">⏸ Paused</span>
        ) : isThinking ? (
          <span className="thinking-indicator">
            <span className="dot" /><span className="dot" /><span className="dot" />
            thinking
          </span>
        ) : (
          <>
            <span className={`turn-dot ${turn === 'w' ? 'turn-dot-w' : 'turn-dot-b'}`} />
            {STATUS_MESSAGES[status](turn)}
          </>
        )}
      </div>

      <div className="topbar-actions">
        {canPause && (
          <button
            className={`btn ${paused ? 'btn-primary' : 'btn-secondary'} btn-pause`}
            onClick={onTogglePause}
            title={paused ? 'Resume game' : 'Pause game'}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}
        <button className="btn btn-secondary" onClick={onFlipBoard}>Flip</button>
        <button className="btn btn-primary" onClick={onNewGame}>New Game</button>
      </div>
    </header>
  )
}
