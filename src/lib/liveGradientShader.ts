/**
 * Fondo animado "Live gradient" para el hero "Que hacemos" de /servicios.
 *
 * WebGL1 puro (mismo enfoque que meshDriftShader.ts): un triangulo
 * fullscreen + shader propio. A diferencia del mesh-drift (blobs radiales
 * que orbitan un centro), este usa ruido simplex 2D con domain warping
 * para generar una superficie de gradiente continua que fluye lentamente,
 * sin centros ni formas discretas - mas cerca de un "gradiente vivo" tipo
 * Velaris (21st.dev) que de un campo de blobs.
 *
 * Paleta: mismos tokens de marca que Sistemas Core (background-8 ->
 * accent-700 -> accent-400 -> accent-300), para que ambas piezas animadas
 * del sitio se sientan parte del mismo sistema visual.
 */

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[4];
uniform vec4 u_scene;   // resolution.xy, time, aspectFix
uniform vec4 u_shape;   // scale, warp, flowSpeed, driftSpeed
uniform vec4 u_finish;  // vignette, grain, brightness, contrast

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_scale u_shape.x
#define u_warp u_shape.y
#define u_flowSpeed u_shape.z
#define u_driftSpeed u_shape.w
#define u_vignette u_finish.x
#define u_grain u_finish.y
#define u_brightness u_finish.z
#define u_contrast u_finish.w

// Ruido simplex 2D clasico (Ashima/McEwan, dominio publico algoritmico).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                  + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

vec3 rampColor(float t) {
  t = clamp(t, 0.0, 1.0);
  // El fbm tiende a concentrarse cerca de 0.5, asi que el tramo vivido
  // (accent-700 -> accent-400 -> accent-300) ocupa la mayor parte del
  // rango y background-8 solo aparece en los valles mas profundos -
  // un "gradiente vivo" en vez de manchas oscuras dominando la imagen.
  if (t < 0.2) return mix(u_colors[0], u_colors[1], t / 0.2);
  if (t < 0.55) return mix(u_colors[1], u_colors[2], (t - 0.2) / 0.35);
  return mix(u_colors[2], u_colors[3], (t - 0.55) / 0.45);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0) * u_scale;

  float t = u_time * u_flowSpeed;

  // Domain warping: dos capas de fbm se retroalimentan para que el
  // gradiente fluya de forma organica, sin repetirse ni orbitar un centro.
  vec2 warpA = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  vec2 warpB = p + u_warp * warpA + vec2(t * u_driftSpeed, -t * u_driftSpeed * 0.6);
  float n = fbm(warpB);

  // Normaliza fbm (~[-1,1]) a [0,1] y agrega una segunda muestra desfasada
  // para variar el contraste local del gradiente.
  float g = n * 0.5 + 0.5;
  float g2 = fbm(warpB * 1.7 + 8.3) * 0.5 + 0.5;
  g = mix(g, g2, 0.25);

  if (abs(u_contrast - 1.0) > 0.0001) g = (g - 0.5) * u_contrast + 0.5;
  g = clamp(g, 0.0, 1.0);

  vec3 col = rampColor(g);
  col += u_brightness;

  if (u_vignette > 0.0001) {
    float vd = length(uv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.05, vd);
  }

  if (u_grain > 0.0001) {
    vec3 p3 = fract(vec3(gl_FragCoord.xy, u_time) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    float grain = fract((p3.x + p3.y) * p3.z);
    col += (grain - 0.5) * u_grain;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// Paleta de marca (low -> high), identica a meshDriftShader.ts para que
// ambas piezas animadas compartan el mismo lenguaje visual.
const PALETTE: [number, number, number][] = [
  [7 / 255, 11 / 255, 16 / 255], // background-8
  [62 / 255, 107 / 255, 24 / 255], // accent-700
  [143 / 255, 209 / 255, 79 / 255], // accent-400
  [180 / 255, 232 / 255, 107 / 255], // accent-300
];

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[liveGradientShader]', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initCanvas(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    antialias: true,
    alpha: false,
    premultipliedAlpha: false,
  });
  if (!gl) return;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[liveGradientShader]', gl.getProgramInfoLog(program));
    return;
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const positionLoc = gl.getAttribLocation(program, 'a_position');

  const uColors = gl.getUniformLocation(program, 'u_colors');
  const uScene = gl.getUniformLocation(program, 'u_scene');
  const uShape = gl.getUniformLocation(program, 'u_shape');
  const uFinish = gl.getUniformLocation(program, 'u_finish');

  const colorData = new Float32Array(12);
  for (let i = 0; i < 4; i++) colorData.set(PALETTE[i], i * 3);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const displayHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (displayWidth !== width || displayHeight !== height) {
      width = displayWidth;
      height = displayHeight;
      canvas.width = width;
      canvas.height = height;
      gl!.viewport(0, 0, width, height);
    }
  }

  function render(timeSeconds: number) {
    gl!.useProgram(program);

    gl!.bindBuffer(gl!.ARRAY_BUFFER, positionBuffer);
    gl!.enableVertexAttribArray(positionLoc);
    gl!.vertexAttribPointer(positionLoc, 2, gl!.FLOAT, false, 0, 0);

    gl!.uniform3fv(uColors, colorData);
    gl!.uniform4f(uScene, width, height, timeSeconds, 0.0);
    // scale, warp, flowSpeed, driftSpeed
    gl!.uniform4f(uShape, 1.35, 0.85, 0.09, 0.05);
    // vignette, grain, brightness, contrast
    gl!.uniform4f(uFinish, 0.24, 0.025, 0.02, 1.4);

    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  resize();

  if (reduceMotion) {
    render(0);
    window.addEventListener(
      'resize',
      () => {
        resize();
        render(0);
      },
      { passive: true }
    );
    return;
  }

  let rafId: number | null = null;
  const startTime = performance.now();

  function frame(now: number) {
    render((now - startTime) / 1000);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('resize', resize, { passive: true });

  start();
}

export function initLiveGradientShader() {
  if (typeof window === 'undefined') return;
  const canvases = document.querySelectorAll<HTMLCanvasElement>('canvas[data-live-gradient]');
  canvases.forEach(initCanvas);
}
