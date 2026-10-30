import { useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useGSAP, MOTION_OK, EASE, isTouch } from './gsap'
import { work } from './content'
import { Eyebrow } from './Eyebrow'
import { RollText } from './RollText'
import { Arrow } from './Arrow'

/**
 * Selected work: real client reels as a grid. Each card plays its clip on
 * hover (pointer devices), the poster drifts inside its frame on scroll, and
 * the title rolls.
 */
export function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.projects__card').forEach((card) => {
          gsap.from(card, { y: 60, autoAlpha: 0, duration: 1.1, ease: EASE, scrollTrigger: { trigger: card, start: 'top 90%', once: true } })
          gsap.fromTo(
            card.querySelector('.projects__media-inner'),
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const play = (e: PointerEvent<HTMLElement>) => {
    if (isTouch()) return
    const v = e.currentTarget.querySelector('video')
    if (!v) return
    v.preload = 'auto'
    v.play().catch(() => {})
  }
  const stop = (e: PointerEvent<HTMLElement>) => {
    const v = e.currentTarget.querySelector('video')
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <section ref={root} className="section projects" id="oh-projects" aria-labelledby="oh-projects-title">
      <div className="wrap">
        <div className="projects__head">
          <div>
            <Eyebrow index={3}>Selected work</Eyebrow>
            <h2 id="oh-projects-title" className="section-title" data-split>
              Work for businesses people visit every day.
            </h2>
          </div>
          <p className="projects__blurb" data-reveal>
            Restaurants, shops, colleges and hospitals across Tamil Nadu. Every clip here was shot and edited by the
            same team that builds websites and runs the ads.
          </p>
        </div>

        <ul className="projects__grid">
          {work.map((w) => (
            <li key={w.title}>
              <Link to="/gallery" className="projects__card roll-host" onPointerEnter={play} onPointerLeave={stop}>
                <div className="projects__media">
                  <div className="projects__media-inner">
                    <img src={w.poster} alt="" loading="lazy" decoding="async" width="720" height="1280" />
                    <video src={w.video} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
                  </div>
                  <span className="projects__view" aria-hidden="true">
                    Watch <Arrow direction="up-right" />
                  </span>
                </div>
                <p className="projects__tags">{w.tags}</p>
                <h3 className="projects__title">
                  <RollText text={w.title} />
                </h3>
                <p className="projects__client" translate="no">
                  {w.client}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="projects__more">
          <Link className="btn btn--primary roll-host" to="/gallery">
            <RollText text="See all our work" />
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
