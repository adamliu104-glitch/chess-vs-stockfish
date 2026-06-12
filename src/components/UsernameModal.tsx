import { useState } from 'react'

type Props = {
  onConfirm: (name: string) => void
}

export function UsernameModal({ onConfirm }: Props) {
  const [name, setName] = useState('')

  function submit() {
    const trimmed = name.trim()
    onConfirm(trimmed || 'Player')
  }

  return (
    <div className="username-overlay">
      <div className="username-modal">
        <div className="username-logo">♞</div>
        <h2 className="username-title">Chess vs Stockfish</h2>
        <p className="username-subtitle">Enter your name to begin</p>
        <input
          className="username-input"
          type="text"
          placeholder="Your name"
          value={name}
          maxLength={20}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn btn-primary username-btn" onClick={submit}>
          Let's Play!
        </button>
        <button
          className="btn btn-secondary username-skip"
          onClick={() => onConfirm('Player')}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
