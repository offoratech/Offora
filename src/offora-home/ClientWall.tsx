import { useState } from 'react'
import { clients } from './content'
import { Eyebrow } from './Eyebrow'

type Client = { id: string; name: string; logo: string }

/**
 * Two rows of client logos drifting in opposite directions. Each row is the
 * list twice so the -50% loop is seamless; hovering pauses, and the button
 * stops the motion for good (it autoplays longer than 5s).
 */
export function ClientWall() {
  const [paused, setPaused] = useState(false)
  const list = clients as Client[]
  const half = Math.ceil(list.length / 2)
  const rows = [list.slice(0, half), list.slice(half)]

  return (
    <section className="section clientwall" id="oh-clients" aria-labelledby="oh-clients-title">
      <div className="wrap clientwall__head">
        <div>
          <Eyebrow index={5}>Trusted by</Eyebrow>
          <h2 id="oh-clients-title" className="section-title" data-split>
            Restaurants, shops, colleges and hospitals that run on our work.
          </h2>
        </div>
        <button className="btn btn--ghost" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? 'Play logos' : 'Pause logos'}
        </button>
      </div>

      <ul className="sr-only">
        {list.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <div className={paused ? 'clientwall__rows is-paused' : 'clientwall__rows'} aria-hidden="true">
        {rows.map((row, r) => (
          <div className={r ? 'clientwall__row clientwall__row--rev' : 'clientwall__row'} key={r}>
            <div className="clientwall__track">
              {[...row, ...row].map((c, i) => (
                <figure className="clientwall__item" key={`${c.id}-${i}`}>
                  <img src={c.logo} alt="" loading="lazy" decoding="async" width="96" height="96" />
                  <figcaption translate="no">{c.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
