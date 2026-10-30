import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../utils/cn.js'

const EASE = [0.22, 1, 0.36, 1]

const fromLeft = { hidden: { x: 14, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.1 } } }
const fromRight = { hidden: { x: -14, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.1 } } }
const pop = { hidden: { scale: 0.6, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: EASE, delay: 0.25 } } }
const draw = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: EASE, delay: 0.35 } } }

/**
 * The `[ 01  LABEL ]` section marker - the brand's bracket motif with an
 * optional section number and a green rule that draws out from it. Matches
 * the home page's Eyebrow. A label written as "01 - Engineering" gets its
 * number pulled into the badge automatically.
 */
export default function Kicker({ children, index, className }) {
  const reduce = useReducedMotion()

  let num = index
  let label = children
  if (num === undefined && typeof children === 'string') {
    const m = children.match(/^(\d{1,2})\s*[-–—]\s*(.+)$/)
    if (m) {
      num = Number(m[1])
      label = m[2]
    }
  }

  return (
    <motion.p
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className={cn(
        'mb-8 flex max-w-full items-center gap-4 text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.2em] sm:text-sm',
        className,
      )}
    >
      <span className="inline-flex flex-none items-center gap-[0.9em]">
        <motion.span
          variants={fromLeft}
          aria-hidden
          className="font-space relative -top-[0.04em] text-[1.9em] font-normal leading-[0.8] tracking-normal text-brand [text-shadow:0_0_18px_rgba(126,217,87,0.45)]"
        >
          [
        </motion.span>
        {num !== undefined && (
          <motion.span
            variants={pop}
            aria-hidden
            className="font-unbounded inline-flex h-[2em] items-center rounded-full border border-brand/30 bg-brand/12 px-[0.7em] text-[0.78em] font-bold tracking-[0.04em] text-brand tabular-nums"
          >
            {String(num).padStart(2, '0')}
          </motion.span>
        )}
        <span className="whitespace-nowrap text-bone">{label}</span>
        <motion.span
          variants={fromRight}
          aria-hidden
          className="font-space relative -top-[0.04em] text-[1.9em] font-normal leading-[0.8] tracking-normal text-brand [text-shadow:0_0_18px_rgba(126,217,87,0.45)]"
        >
          ]
        </motion.span>
      </span>
      <motion.span
        variants={draw}
        aria-hidden
        className="h-px flex-[0_1_clamp(48px,9vw,140px)] origin-left bg-gradient-to-r from-brand to-transparent"
      />
    </motion.p>
  )
}
