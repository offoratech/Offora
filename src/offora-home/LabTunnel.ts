import * as THREE from 'three'

const LENGTH = 220
const BLOCKS = 1400
const GLOWS = 500
const SPARKS = 900

// Offora green ramp only - the brand allows one accent and no second hue.
const WALL = ['#173a22', '#22552f', '#2f7040', '#3f8d52']
const GLOW = ['#7ed957', '#a6e88a', '#d3f5c4', '#ffffff']

/** Instanced blocks lining a square tunnel, either lit walls or unlit glowing chips. */
function blocks(count: number, glow: boolean) {
  const geo = new THREE.BoxGeometry()
  const mat = glow
    ? new THREE.MeshBasicMaterial({ toneMapped: false })
    : new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  const palette = (glow ? GLOW : WALL).map((c) => new THREE.Color(c))
  const m = new THREE.Object3D()
  for (let i = 0; i < count; i++) {
    const across = (Math.random() - 0.5) * 9
    const depth = 4.2 + Math.random() * 1.2
    const [x, y] = [
      [across, depth],
      [across, -depth],
      [depth, across],
      [-depth, across],
    ][i % 4]
    m.position.set(x, y, -Math.random() * LENGTH)
    if (glow) m.scale.set(0.05 + Math.random() * 0.4, 0.05 + Math.random() * 0.4, 0.05 + Math.random() * 0.8)
    else m.scale.set(0.2 + Math.random() * 1.6, 0.2 + Math.random() * 1.6, 0.3 + Math.random() * 3)
    m.updateMatrix()
    mesh.setMatrixAt(i, m.matrix)
    mesh.setColorAt(i, palette[i % palette.length])
  }
  return mesh
}

function sparks() {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array(SPARKS * 3)
  const col = new Float32Array(SPARKS * 3)
  const palette = GLOW.map((c) => new THREE.Color(c))
  for (let i = 0; i < SPARKS; i++) {
    pos.set([(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, -Math.random() * LENGTH], i * 3)
    palette[i % palette.length].toArray(col, i * 3)
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const mat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geo, mat)
}

/**
 * The Lab section's scene: the camera flies down a tunnel of code-like blocks
 * as `progress` (0 → 1, set from scroll) advances, drifting with the pointer.
 */
export class LabTunnel {
  progress = 0
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(70, 1, 0.1, 120)
  private light = new THREE.PointLight('#7ed957', 80, 40)
  private sparks: THREE.Points
  private pointer = new THREE.Vector2()
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private ro: ResizeObserver

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    host.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color('#050806')
    this.scene.fog = new THREE.Fog('#050806', 10, 70)
    this.scene.add(new THREE.HemisphereLight('#c9f2bb', '#06140a', 1.2))
    this.scene.add(this.light)
    this.scene.add(blocks(BLOCKS, false), blocks(GLOWS, true))
    this.sparks = sparks()
    this.scene.add(this.sparks)
    this.camera.position.set(0, 0, 8)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(host)
    this.resize()
    window.addEventListener('pointermove', this.onPointer, { passive: true })
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.host
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /** One frame. Also used once for the static, reduced-motion render. */
  render(dt = 0) {
    const cam = this.camera
    // Slow idle glide so the tunnel breathes before the visitor scrolls.
    const glide = dt ? Math.sin(this.clock.elapsedTime * 0.25) * 1.5 : 0
    const targetZ = 8 - this.progress * (LENGTH - 30) - glide
    cam.position.z = dt ? THREE.MathUtils.damp(cam.position.z, targetZ, 4, dt) : targetZ
    cam.position.x = THREE.MathUtils.damp(cam.position.x, this.pointer.x * 1.2, 3, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, this.pointer.y * 0.8, 3, dt)
    cam.rotation.z = Math.sin(cam.position.z * 0.02) * 0.15
    this.light.position.set(cam.position.x, cam.position.y, cam.position.z - 8)
    ;(this.sparks.material as THREE.PointsMaterial).opacity = 0.7 + Math.sin(this.clock.elapsedTime * 3) * 0.2
    this.renderer.render(this.scene, cam)
  }

  private tick = () => {
    this.raf = requestAnimationFrame(this.tick)
    this.render(Math.min(this.clock.getDelta(), 1 / 20))
  }

  play() {
    if (this.running) return
    this.running = true
    this.clock.getDelta()
    this.tick()
  }

  pause() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.pause()
    this.ro.disconnect()
    window.removeEventListener('pointermove', this.onPointer)
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      mesh.geometry?.dispose()
      const mat = mesh.material as THREE.Material | undefined
      mat?.dispose()
    })
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
  }
}
