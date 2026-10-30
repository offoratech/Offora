import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap, useGSAP, MOTION_OK, EASE } from './gsap'
import { testimonials } from './content'
import { Eyebrow } from './Eyebrow'
import { Arrow } from './Arrow'

const INTERVAL = 3000

/**
 * One large quote at a time with prev/next, a counter, and a crossfade.
 * Advances every 3s while on screen; hovering or focusing the section holds
 * it, the pause button stops it, and any manual change restarts the timer.
 */
export function Voices() {
  const root = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [held, setHeld] = useState(false)
  // The observer reports the real state on its first callback, right after mount.
  const [inView, setInView] = useState(true)
  const t = testimonials[i]
  const go = (d: number) => setI((n) => (n + d + testimonials.length) % testimonials.length)
  const running = playing && !held && inView

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keyed on `i`, so a click on an arrow or dot gives the new quote a full 3s.
  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => go(1), INTERVAL)
    return () => window.clearTimeout(id)
  }, [running, i])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.voices__quote > *', { autoAlpha: 0, y: 24, duration: 0.8, ease: EASE, stagger: 0.08 })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [i], revertOnUpdate: true },
  )

  return (
    <section
      ref={root}
      className="section voices"
      id="oh-voices"
      aria-labelledby="oh-voices-title"
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false)
      }}
    >
      <div className="wrap">
        <div className="voices__top">
          <Eyebrow index={6}>In their words</Eyebrow>
          <div className="voices__nav">
            {/* Announce changes only when the visitor drives them, not every 3s. */}
            <span className="voices__count" aria-live={running ? 'off' : 'polite'}>
              {String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause testimonials' : 'Play testimonials'} aria-pressed={!playing}>
              <span className={playing ? 'voices__icon voices__icon--pause' : 'voices__icon voices__icon--play'} aria-hidden="true" />
            </button>
            <button onClick={() => go(-1)} aria-label="Previous testimonial">
              <Arrow direction="left" />
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonial">
              <Arrow />
            </button>
          </div>
        </div>
        <h2 id="oh-voices-title" className="sr-only">
          What clients say
        </h2>
        <figure className="voices__quote" key={i}>
          <span className="voices__mark" aria-hidden="true">“</span>
          <blockquote>
            <p>{t.quote}</p>
          </blockquote>
          <figcaption>
            <span className="voices__org" translate="no">
              {t.org}
            </span>
            <span className="voices__role">{t.role}</span>
          </figcaption>
        </figure>
        <div className="voices__dots" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((q, n) => (
            <button
              key={q.org}
              role="tab"
              aria-selected={n === i}
              aria-label={`${q.org} testimonial`}
              className={n === i ? (running ? 'is-active is-running' : 'is-active') : ''}
              style={{ '--dur': `${INTERVAL}ms` } as CSSProperties}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
