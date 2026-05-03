"use client"

import { useEffect, useRef } from "react"
import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute,
  RawShaderMaterial,
  Mesh,
  Vector2,
  DoubleSide,
  NormalBlending,
  Material,
} from "three"

export default function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: Scene | null
    camera: OrthographicCamera | null
    renderer: WebGLRenderer | null
    mesh: Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        r = clamp(r, 0.0, 1.0);
        g = clamp(g, 0.0, 1.0);
        b = clamp(b, 0.0, 1.0);

        float alpha = clamp(max(r, max(g, b)), 0.0, 1.0);

        gl_FragColor = vec4(r, g, b, alpha);
      }
    `

    const initScene = () => {
      refs.scene = new Scene()
      refs.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true })
      refs.renderer.setPixelRatio(1)
      refs.renderer.setClearColor(0x000000, 0)

      refs.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: new Vector2(canvas.clientWidth, canvas.clientHeight) },
        time: { value: 0.0 },
        xScale: { value: 2.0 },
        yScale: { value: 0.12 },
        distortion: { value: 0.05 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new BufferAttribute(new Float32Array(position), 3)
      const geometry = new BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: DoubleSide,
        transparent: true,
        blending: NormalBlending,
        depthWrite: false,
      })

      refs.mesh = new Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.006
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value.set(width, height)
    }

    initScene()

    // Pause RAF when Hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!refs.animationId) animate()
        } else {
          if (refs.animationId) {
            cancelAnimationFrame(refs.animationId)
            refs.animationId = null
          }
        }
      },
      { threshold: 0.01 }
    )
    observer.observe(canvas)
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      observer.disconnect()
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{ mixBlendMode: "normal", opacity: 0.85 }}
    />
  )
}
