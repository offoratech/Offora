import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Megaphone } from 'lucide-react'
import { gsap, useGSAP, MOTION_OK, EASE } from './gsap'
import { serviceGroups } from '../data/services.js'
import { Eyebrow } from './Eyebrow'
import { RollText } from './RollText'
import { Arrow } from './Arrow'

type Service = { title: string; description: string }
type Group = { id: string; label: string; kicker: string; title: string; description: string; services: Service[] }

const icons: Record<string, typeof Code2> = { technical: Code2, marketing: Megaphone }

/**
 * Two tabs - Build and Market - over one list. Each row rolls its title on
 * hover and opens its description in place. The tab is mirrored in the URL
 * hash so a link can open either side.
 */
export function Services() {
  const root = useRef<HTMLElement>(null)
  const groups = serviceGroups as Group[]
  const [active, setActive] = useState(() => (window.location.hash === '#marketing' ? 1 : 0))
  const [open, setOpen] = useState<number | null>(0)
  const group = groups[active]
  const Icon = icons[group.id]

  const pick = (i: number) => {
    setActive(i)
    setOpen(0)
    history.replaceState(null, '', `#${groups[i].id}`)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.svc__row', { autoAlpha: 0, y: 24, duration: 0.8, ease: EASE, stagger: 0.05 })
      })
      return () => mm.revert()
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  )

  return (
    <section ref={root} className="section svc" id="oh-services" aria-labelledby="oh-services-title">
      <div className="wrap svc__grid">
        <div className="svc__aside">
          <Eyebrow index={2}>What we do</Eyebrow>
          <h2 id="oh-services-title" className="section-title" data-split>
            Everything your business needs online. One team.
          </h2>
          <div className="svc__tabs" role="tablist" aria-label="Service groups">
            {groups.map((g, i) => (
              <button
                key={g.id}
                role="tab"
                id={`svc-tab-${g.id}`}
                aria-selected={active === i}
                aria-controls="svc-panel"
                className={active === i ? 'svc__tab is-active' : 'svc__tab'}
                onClick={() => pick(i)}
              >
                {g.id === 'technical' ? 'Build' : 'Market'}
                <sup>{g.services.length}</sup>
              </button>
            ))}
          </div>
          <div className="svc__intro" key={group.id}>
            <Icon className="svc__icon" size={28} aria-hidden="true" />
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <Link className="btn btn--ghost roll-host" to="/services">
              <RollText text="All services" />
              <Arrow />
            </Link>
          </div>
        </div>

        <ol className="svc__list" id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${group.id}`}>
          {group.services.map((s, i) => {
            const isOpen = open === i
            return (
              <li className={isOpen ? 'svc__row is-open' : 'svc__row'} key={s.title}>
                <button className="svc__head roll-host" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc__title">
                    <RollText text={s.title} />
                  </span>
                  <span className="svc__plus" aria-hidden="true" />
                </button>
                <div className="svc__body">
                  <p>{s.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
