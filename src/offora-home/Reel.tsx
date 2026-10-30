import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MOTION_OK } from './gsap'
import { reels } from './content'

/**
 * Showreel: a card that grows to full width as it scrolls in while "WATCH" and
 * "OUR WORK" slide apart around the play button. Inside, three of our own
 * vertical reels play muted; the button pauses or resumes all of them.
 */
export function Reel() {
  const root = useRef<HTMLElement>(null)
  const videos = useRef<HTMLVideoElement[]>([])
  const [playing, setPlaying] = useState(false)
  const userPaused = useRef(false)

  // Play only while on screen; never autoplay for reduced motion.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) {
          videos.current.forEach((v) => {
            v.preload = 'auto'
            v.play().catch(() => {})
          })
          setPlaying(true)
        } else {
          videos.current.forEach((v) => v.pause())
          setPlaying(false)
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const next = !playing
    userPaused.current = !next
    videos.current.forEach((v) => (next ? v.play().catch(() => {}) : v.pause()))
    setPlaying(next)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: true } })
          .fromTo('.reel__card', { scale: 0.6 }, { scale: 1, ease: 'none' }, 0)
          .fromTo('.reel__word--l', { xPercent: 50 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo('.reel__word--r', { xPercent: -50 }, { xPercent: 0, ease: 'none' }, 0)
          .fromTo('.reel__phone', { yPercent: 18 }, { yPercent: 0, stagger: 0.05, ease: 'none' }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="reel" id="oh-reel" aria-label="Showreel">
      <div className="wrap">
        <div className="reel__card">
          <div className="reel__phones">
            {reels.map((r, i) => (
              <figure className="reel__phone" key={r.title}>
                <video
                  ref={(v) => {
                    if (v) videos.current[i] = v
                  }}
                  src={r.video}
                  poster={r.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={r.title}
                />
                <figcaption>{r.title}</figcaption>
              </figure>
            ))}
          </div>
          <div className="reel__words" aria-hidden="true">
            <span className="reel__word reel__word--l">WATCH</span>
            <span className="reel__gap" />
            <span className="reel__word reel__word--r">OUR WORK</span>
          </div>
          <button className="reel__play" onClick={toggle} aria-label={playing ? 'Pause showreel' : 'Play showreel'}>
            <span className={playing ? 'reel__icon reel__icon--pause' : 'reel__icon'} />
          </button>
        </div>
      </div>
    </section>
  )
}
