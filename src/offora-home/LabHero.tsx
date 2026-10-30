import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, MOTION_OK, EASE } from './gsap'
import { webglAvailable } from './webgl'
import { contactEmail } from './content'
import { RollText } from './RollText'
import { Arrow } from './Arrow'
import type { LabTunnel } from './LabTunnel'

const captions = ['Code and campaigns,', 'planned side by side,', 'shipped by one team.']

/**
 * The home page opens inside the Offora Lab: a full-screen WebGL tunnel with
 * the headline over it. The section is tall and its stage is sticky, so
 * scrolling first lifts the headline away, then flies the camera down the
 * tunnel while three captions hand over, and finally releases into the page.
 * Without WebGL, or with reduced motion, it is a normal one-screen hero.
 */
export function LabHero() {
  const root = useRef<HTMLElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const tunnel = useRef<LabTunnel | null>(null)
  const [webgl] = useState(webglAvailable)

  // Three.js loads as its own chunk so the headline paints first.
  useEffect(() => {
    if (!webgl || !host.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let cleanup = () => {}
    import('./LabTunnel').then(({ LabTunnel }) => {
      if (disposed || !host.current) return
      const t = new LabTunnel(host.current)
      tunnel.current = t
      host.current.classList.add('is-live')
      if (reduce) {
        t.progress = 0.2
        t.render()
        cleanup = () => t.dispose()
        return
      }
      const io = new IntersectionObserver(([v]) => (v.isIntersecting ? t.play() : t.pause()))
      io.observe(host.current)
      cleanup = () => {
        io.disconnect()
        t.dispose()
      }
    })
    return () => {
      disposed = true
      cleanup()
      tunnel.current = null
    }
  }, [webgl])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Entrance
        const split = SplitText.create('.lab-hero__title .line > span', { type: 'chars', charsClass: 'char' })
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from(split.chars, { yPercent: 115, duration: 1.3, stagger: 0.025 })
          .from('.lab-hero__sub, .lab-hero__ctas', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 }, 0.4)

        // Scroll: headline lifts away, captions take over, tunnel advances.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              onUpdate: (st) => {
                if (tunnel.current) tunnel.current.progress = st.progress
              },
            },
          })
          .to('.lab-hero__content', { autoAlpha: 0, y: -80, duration: 0.18 }, 0.02)
          .fromTo('.lab-hero__cap', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.24, duration: 0.1 }, 0.2)
          .to('.lab-hero__cap', { autoAlpha: 0, y: -50, stagger: 0.24, duration: 0.1 }, 0.36)
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className={webgl ? 'lab-hero lab-hero--webgl' : 'lab-hero'} id="oh-lab" aria-labelledby="oh-hero-title">
      <div className="lab-hero__stage">
        <div ref={host} className="lab-hero__canvas" aria-hidden="true" />
        <div className="lab-hero__veil" aria-hidden="true" />

        <div className="lab-hero__content wrap">
          <h1 id="oh-hero-title" className="lab-hero__title">
            <span className="line"><span>We build it.</span></span>
            <span className="line"><span>We market it.</span></span>
            <span className="line line--accent"><span>Same team.</span></span>
          </h1>
          <p className="lab-hero__sub">
            Offora Tech is a two-founder studio from Tamil Nadu. We make the website, app or software your business runs
            on - and the campaigns that bring people to it.
          </p>
          <div className="lab-hero__ctas">
            <a className="btn btn--primary roll-host" href={`mailto:${contactEmail}`}>
              <RollText text="Start a project" />
              <Arrow />
            </a>
            <a className="btn btn--ghost roll-host" href="#oh-projects">
              <RollText text="See our work" />
              <Arrow direction="down" />
            </a>
          </div>
        </div>

        <div className="lab-hero__caps" aria-hidden="true">
          {captions.map((c) => (
            <p className="lab-hero__cap" key={c}>
              {c}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
