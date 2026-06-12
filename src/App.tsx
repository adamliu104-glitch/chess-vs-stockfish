import { useState, useEffect } from 'react'
import { TopBar } from './components/TopBar'
import { Board } from './components/Board'
import { GameStatus } from './components/GameStatus'
import { MoveHistory } from './components/MoveHistory'
import { PromotionModal } from './components/PromotionModal'
import { GameOverModal } from './components/GameOverModal'
import { UsernameModal } from './components/UsernameModal'
import { useChessGame } from './hooks/useChessGame'
import type { BoardTheme } from './engine/types'
import { BOARD_THEMES } from './engine/types'
import './App.css'

function loadTheme(): BoardTheme {
  const saved = localStorage.getItem('boardTheme')
  return BOARD_THEMES.some((t) => t.id === saved) ? (saved as BoardTheme) : 'walnut'
}

function loadUsername(): string | null {
  return localStorage.getItem('username')
}

export default function App() {
  const {
    pieces,
    selectedSquare,
    legalTargets,
    lastMove,
    checkSquare,
    status,
    turn,
    moveHistory,
    isThinking,
    pendingPromotion,
    orientation,
    playerColor,
    difficulty,
    timeControl,
    whiteMs,
    blackMs,
    clockStarted,
    paused,
    capturedPieces,
    handleSquareClick,
    handlePromotion,
    newGame,
    flipBoard,
    setDifficulty,
    setTimeControl,
    togglePause,
  } = useChessGame()

  const [boardTheme, setBoardTheme] = useState<BoardTheme>(loadTheme)
  useEffect(() => {
    localStorage.setItem('boardTheme', boardTheme)
  }, [boardTheme])

  const [username, setUsername] = useState<string | null>(loadUsername)
  function handleUsernameConfirm(name: string) {
    localStorage.setItem('username', name)
    setUsername(name)
  }

  const isOver =
    status === 'checkmate' || status === 'stalemate' || status === 'draw' || status === 'timeout'
  const [showResult, setShowResult] = useState(false)
  useEffect(() => {
    if (!isOver) {
      setShowResult(false)
      return
    }
    const t = window.setTimeout(() => setShowResult(true), 700)
    return () => window.clearTimeout(t)
  }, [isOver])

  return (
    <div className="app">
      <TopBar
        status={status}
        turn={turn}
        isThinking={isThinking}
        paused={paused}
        clockStarted={clockStarted}
        onNewGame={newGame}
        onFlipBoard={flipBoard}
        onTogglePause={togglePause}
      />

      <main className="main">
        <div className="board-container">
          <Board
            pieces={pieces}
            selectedSquare={selectedSquare}
            legalTargets={legalTargets}
            lastMove={lastMove}
            checkSquare={checkSquare}
            orientation={orientation}
            theme={boardTheme}
            paused={paused}
            onSquareClick={handleSquareClick}
          />
        </div>

        <aside className="sidebar">
          <GameStatus
            status={status}
            turn={turn}
            playerColor={playerColor}
            username={username ?? 'Player'}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onNewGame={newGame}
            timeControl={timeControl}
            whiteMs={whiteMs}
            blackMs={blackMs}
            clockStarted={clockStarted}
            onTimeControlChange={setTimeControl}
            boardTheme={boardTheme}
            onBoardThemeChange={setBoardTheme}
            capturedPieces={capturedPieces}
          />
          <MoveHistory moves={moveHistory} />
        </aside>
      </main>

      {pendingPromotion && (
        <PromotionModal color={playerColor} onSelect={handlePromotion} />
      )}

      {showResult && (
        <GameOverModal
          status={status}
          turn={turn}
          playerColor={playerColor}
          onNewGame={newGame}
          onClose={() => setShowResult(false)}
        />
      )}

      {username === null && (
        <UsernameModal onConfirm={handleUsernameConfirm} />
      )}
    </div>
  )
}
