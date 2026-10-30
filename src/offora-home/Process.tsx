import { useRef } from 'react'
import { gsap, useGSAP, MOTION_OK } from './gsap'
import { Eyebrow } from './Eyebrow'

const steps = [
  { title: 'You brief us once', text: 'One call with both founders. We learn how your business actually runs before we suggest anything.' },
  { title: 'We plan both halves', text: 'The site and the campaign are planned together, so every ad points to a page made for it.' },
  { title: 'We build and launch', text: 'Website, app or software goes live - tested on real phones, with analytics wired in from day one.' },
  { title: 'We market and improve', text: 'Content, reels and Meta ads run on top. What we learn from the ads goes straight back into the site.' },
]

/** Four steps on a rail that fills as the section scrolls past. */
export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: '.process__steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } })
          .from('.process__fill', { scaleX: 0, transformOrigin: 'left center', ease: 'none' }, 0)
          .from('.process__dot', { scale: 0, stagger: 0.25, ease: 'back.out(3)', duration: 0.1 }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section process" id="oh-process" aria-labelledby="oh-process-title">
      <div className="wrap">
        <Eyebrow index={4}>How we work</Eyebrow>
        <h2 id="oh-process-title" className="section-title" data-split>
          No hand-offs. No lost context.
        </h2>
        <div className="process__rail" aria-hidden="true">
          <span className="process__fill" />
        </div>
        <ol className="process__steps">
          {steps.map((s, i) => (
            <li className="process__step" key={s.title} data-reveal>
              <span className="process__dot" aria-hidden="true" />
              <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
