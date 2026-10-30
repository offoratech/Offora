import { useRef } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK } from './gsap'
import { clients } from './content'
import { serviceGroups } from '../data/services.js'
import { Eyebrow } from './Eyebrow'

const serviceCount = serviceGroups.reduce((n: number, g: { services: unknown[] }) => n + g.services.length, 0)

const stats = [
  { value: 2, suffix: '', label: 'Founders who do the work themselves' },
  { value: clients.length, suffix: '+', label: 'Businesses we’ve built and marketed for' },
  { value: serviceCount, suffix: '', label: 'Services, from code to campaigns' },
  { value: 1, suffix: '', label: 'Team to brief, once' },
]

/**
 * Right after the lab: the problem Offora solves, lit word by word as it
 * scrolls past, then the numbers counting up.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.statement__text', { type: 'words', wordsClass: 'statement__w' })
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.statement__text', start: 'top 80%', end: 'bottom 45%', scrub: true } },
        )
        gsap.utils.toArray<HTMLElement>('.stat__num').forEach((el) => {
          const end = Number(el.dataset.value)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: end,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => (el.textContent = Math.round(obj.v) + (el.dataset.suffix ?? '')),
          })
        })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="section statement" id="oh-statement" aria-labelledby="oh-statement-title">
      <div className="wrap">
        <Eyebrow index={1}>Why Offora</Eyebrow>
        <h2 id="oh-statement-title" className="statement__text">
          Most businesses hire one agency to build and another to market - then end up translating between them.
          With us, the people who build your site plan the campaigns that fill it.
        </h2>
        <dl className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label} data-reveal>
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__num" data-value={s.value} data-suffix={s.suffix}>
                {s.value}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
