"use client";
import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { gsap } from "gsap";

const AnimatedRobotLogo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ring1CanvasRef = useRef<HTMLDivElement>(null);
  const ring2CanvasRef = useRef<HTMLDivElement>(null);
  const ring3CanvasRef = useRef<HTMLDivElement>(null);
  const ring4CanvasRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float innerRadius;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.972549, 0.443137, 0.443137); // red-400
    const vec3 baseColor2 = vec3(1.0, 1.0, 1.0); // white
    const vec3 baseColor3 = vec3(0.231373, 0.509804, 0.964706); // blue-500
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + v1) * v2 * v3;
      col = clamp(col, 0.0, 1.0);
      
      return extractAlpha(col);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = containerRef.current;
    const ring1Canvas = ring1CanvasRef.current;
    const ring2Canvas = ring2CanvasRef.current;
    const ring3Canvas = ring3CanvasRef.current;
    const ring4Canvas = ring4CanvasRef.current;
    const robot = robotRef.current;
    const particles = particlesRef.current;

    if (
      !container ||
      !ring1Canvas ||
      !ring2Canvas ||
      !ring3Canvas ||
      !ring4Canvas ||
      !robot ||
      !particles
    )
      return;

    // Initialize WebGL for each ring
    const renderers: Renderer[] = [];
    const programs: Program[] = [];
    const meshes: Mesh[] = [];
    const canvasRefs = [ring1Canvas, ring2Canvas, ring3Canvas, ring4Canvas];
    const innerRadii = [0.85, 0.75, 0.65, 0.55]; // Adjusted for larger rings

    canvasRefs.forEach((canvas, index) => {
      const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      canvas.appendChild(gl.canvas);
      renderers.push(renderer);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          iTime: { value: 0 },
          iResolution: {
            value: new Vec3(
              gl.canvas.width,
              gl.canvas.height,
              gl.canvas.width / gl.canvas.height
            ),
          },
          hue: { value: 0 },
          hover: { value: 0 },
          rot: { value: 0 },
          hoverIntensity: { value: 0.2 },
          innerRadius: { value: innerRadii[index] },
        },
      });
      programs.push(program);

      const mesh = new Mesh(gl, { geometry, program });
      meshes.push(mesh);
    });

    // Individual ring rotations with increased speed
    gsap.to(ring1Canvas, {
      rotation: 360,
      duration: 2,
      ease: "none",
      repeat: -1,
    });

    gsap.to(ring2Canvas, {
      rotation: -360,
      duration: 3,
      ease: "none",
      repeat: -1,
    });

    gsap.to(ring3Canvas, {
      rotation: 360,
      duration: 2.5,
      ease: "none",
      repeat: -1,
    });

    gsap.to(ring4Canvas, {
      rotation: -360,
      duration: 3.5,
      ease: "none",
      repeat: -1,
    });

    // Position-swapping animations with 4px gap
    gsap.to(ring1Canvas, {
      "--inset": "16px",
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0,
    });

    gsap.to(ring2Canvas, {
      "--inset": "12px",
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.5,
    });

    gsap.to(ring3Canvas, {
      "--inset": "8px",
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1,
    });

    gsap.to(ring4Canvas, {
      "--inset": "4px",
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.5,
    });

    function resize() {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderers.forEach((renderer, index) => {
        renderer.setSize(width * dpr, height * dpr);
        const gl = renderer.gl;
        gl.canvas.style.width = `${width}px`;
        gl.canvas.style.height = `${height}px`;
        programs[index].uniforms.iResolution.value.set(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      });
    }
    window.addEventListener("resize", resize);
    resize();

    let targetHover: number = 0;
    let lastTime: number = 0;
    let currentRot: number = 0;
    const rotationSpeed: number = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ring3Canvas) return;
      const rect = ring3Canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;

      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
        targetHover = 1;
      } else {
        targetHover = 0;
      }
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    ring3Canvas.addEventListener("mousemove", handleMouseMove);
    ring3Canvas.addEventListener("mouseleave", handleMouseLeave);

    let rafId: number;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      programs.forEach((program) => {
        program.uniforms.iTime.value = t * 0.001;
        program.uniforms.hue.value = 0;
        program.uniforms.hoverIntensity.value = 0.2;
        program.uniforms.hover.value +=
          (targetHover - program.uniforms.hover.value) * 0.1;
        if (targetHover > 0.5) {
          currentRot += dt * rotationSpeed;
        }
        program.uniforms.rot.value = currentRot;
      });

      renderers.forEach((renderer, index) => {
        renderer.render({ scene: meshes[index] });
      });
    };
    rafId = requestAnimationFrame(update);

    gsap.to(robot, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(robot, {
      filter: "drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))",
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    const particleElements = particles.children;
    Array.from(particleElements).forEach((particle: Element, index: number) => {
      gsap.to(particle, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        rotation: `random(0, 360)`,
        scale: `random(0.5, 1.5)`,
        opacity: `random(0.3, 1)`,
        duration: `random(3, 6)`,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      ring3Canvas.removeEventListener("mousemove", handleMouseMove);
      ring3Canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvasRefs.forEach((canvas, index) => {
        const gl = renderers[index].gl;
        canvas.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      });
    };
  });

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      <style jsx>{`
        .ring-container {
          position: absolute;
          inset: var(--inset, 0);
          width: 100%;
          height: 100%;
        }
        .ring1 {
          --inset: 16px;
        }
        .ring2 {
          --inset: 12px;
        }
        .ring3 {
          --inset: 8px;
        }
        .ring4 {
          --inset: 4px;
        }
      `}</style>
      <div
        ref={containerRef}
        className="relative w-full h-[480px] flex items-center justify-center"
      >
        {/* Ring 1 */}
        <div
          ref={ring1CanvasRef}
          className="absolute ring1 rounded-full ring-container"
        />

        {/* Ring 2 */}
        <div
          ref={ring2CanvasRef}
          className="absolute ring2 rounded-full ring-container"
        />

        {/* Ring 3 */}
        <div
          ref={ring3CanvasRef}
          className="absolute ring3 rounded-full ring-container"
        />

        {/* Ring 4 */}
        <div
          ref={ring4CanvasRef}
          className="absolute ring4 rounded-full ring-container"
        />

        {/* Robot Character inside the innermost circle */}
        <div
          ref={robotRef}
          className="relative z-10 flex flex-col items-center justify-center w-24 h-24"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Robot Head */}
          <div className="w-20 h-20 bg-purple-600 rounded-full mb-2 relative shadow-2xl border-4 border-purple-400">
            {/* Eyes */}
            <div className="absolute top-6 left-4 w-2 h-2 bg-white rounded-full shadow-2xl"></div>
            <div className="absolute top-6 right-4 w-2 h-2 bg-white rounded-full shadow-2xl"></div>

            {/* Eye pupils */}
            <div className="absolute top-7 left-5 w-1 h-1 bg-black rounded-full shadow-2xl"></div>
            <div className="absolute top-7 right-5 w-1 h-1 bg-black rounded-full shadow-2xl"></div>

            {/* Antenna */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-purple-400 rounded-full shadow-2xl"></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-300 rounded-full shadow-2xl"></div>
          </div>

          {/* Robot Body */}
          <div className="w-20 h-16 bg-purple-600 rounded-lg shadow-2xl border-4 border-purple-400 relative">
            {/* Body details */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-purple-400 rounded-full shadow-2xl"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-purple-400 rounded-full shadow-2xl"></div>
          </div>

          {/* Robot Arms */}
          <div className="absolute top-8 -left-8 w-6 h-12 bg-purple-600 rounded-full border-2 border-purple-400 shadow-2xl"></div>
          <div className="absolute top-8 -right-8 w-6 h-12 bg-purple-600 rounded-full border-2 border-purple-400 shadow-2xl"></div>
        </div>

        {/* Particles */}
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 shadow-2xl"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${
                  i * 18
                }deg) translateY(-${120 + i * 8}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedRobotLogo;
