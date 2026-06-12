import type { Color, PieceSymbol, BoardTheme } from '../engine/types'

type Props = { type: PieceSymbol; color: Color; theme?: BoardTheme }

const NAMES: Record<PieceSymbol, string> = {
  k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn',
}

const SHREK_NAMES: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: 'Shrek', q: 'Fiona', r: 'Castle Guard', b: 'Fairy Godmother', n: 'Donkey', p: 'Pinocchio' },
  b: { k: 'Lord Farquaad', q: 'Dragon', r: 'Duloc Guard', b: 'Rumpelstiltskin', n: 'Puss in Boots', p: 'Big Bad Wolf' },
}

export function Piece({ type, color, theme }: Props) {
  if (theme === 'shrek') {
    return (
      <img
        className="piece"
        src={`/pieces/shrek/${color}${type}.svg`}
        alt={SHREK_NAMES[color][type]}
        draggable={false}
      />
    )
  }

  return (
    <img
      className="piece"
      src={`/pieces/${color}${type}.svg`}
      alt={`${color === 'w' ? 'white' : 'black'} ${NAMES[type]}`}
      draggable={false}
    />
  )
}
