"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform vec2 uMouse;      // -1..1
  uniform float uImgAspect;
  uniform float uPlaneAspect;

  void main() {
    // cover-fit the texture to the plane
    vec2 uv = vUv;
    float ratio = uPlaneAspect / uImgAspect;
    if (ratio < 1.0) {
      uv.x = (uv.x - 0.5) * ratio + 0.5;
    } else {
      uv.y = (uv.y - 0.5) / ratio + 0.5;
    }

    // pointer parallax + gentle breathing displacement
    vec2 par = uMouse * 0.016;
    float wave = sin(uv.y * 6.0 + uTime * 0.25) * 0.0015;
    uv += par + vec2(wave, wave * 0.6);

    vec4 col = texture2D(uTex, uv);

    // warm gold grade + soft vignette-in-shader for depth
    col.rgb = pow(col.rgb, vec3(0.98));
    col.rgb *= vec3(1.04, 1.0, 0.92);
    float d = distance(vUv, vec2(0.5));
    col.rgb *= smoothstep(1.15, 0.25, d);

    gl_FragColor = col;
  }
`;

function Plane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const tex = useTexture("/art/hero-glory.jpg");
  const { viewport } = useThree();

  tex.colorSpace = THREE.SRGBColorSpace;
  const img = tex.image as { width?: number; height?: number } | undefined;
  const imgAspect = img?.width && img?.height ? img.width / img.height : 2.6;

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uImgAspect: { value: imgAspect },
      uPlaneAspect: { value: 1 },
    }),
    [tex, imgAspect]
  );

  useFrame((state) => {
    const m = mat.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uPlaneAspect.value = viewport.width / viewport.height;
    (m.uniforms.uMouse.value as THREE.Vector2).lerp(state.pointer, 0.045);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 1], fov: 50 }}
    >
      <Suspense fallback={null}>
        <Plane />
      </Suspense>
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.25}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0006, 0.0009)}
        />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.28} />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
