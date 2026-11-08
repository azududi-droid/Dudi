import React, {useEffect, useMemo, useState} from "react";
import {ThreeCanvas} from "@remotion/three";
import {useCurrentFrame, useVideoConfig, staticFile, interpolate, continueRender, delayRender} from "remotion";
import * as THREE from "three";

const PHOTOS = ["p1.jpg", "p2.jpg", "p3.jpg", "p4.jpg", "p5.jpg", "p6.jpg", "p7.jpg"];

// Loads all photo textures before rendering a frame, so every frame is complete.
const useTextures = () => {
  const [handle] = useState(() => delayRender("load textures"));
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(PHOTOS.map((p) => loader.loadAsync(staticFile(p)))).then((t) => {
      t.forEach((tex) => { tex.colorSpace = THREE.SRGBColorSpace; });
      setTextures(t);
      continueRender(handle);
    });
  }, [handle]);
  return textures;
};

const PhotoRing: React.FC<{textures: THREE.Texture[]}> = ({textures}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / durationInFrames;

  // Ring rotation: ease, one full turn across the video
  const rot = t * Math.PI * 2 * 0.9;
  const radius = 3.2;
  // Rise into view, then drop away at the end
  const lift = interpolate(frame, [0, 60, durationInFrames - 60, durationInFrames], [-4, 0, 0, -4], {extrapolateRight: "clamp"});

  return (
    <group rotation={[0, rot, 0]} position={[0, lift, 0]}>
      {textures.map((tex, i) => {
        const a = (i / textures.length) * Math.PI * 2;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        const tilt = Math.sin(frame / 25 + i) * 0.05;
        return (
          <mesh key={i} position={[x, Math.sin(frame / 30 + i) * 0.15, z]} rotation={[0, a, tilt]}>
            <planeGeometry args={[1.8, 3.2]} />
            <meshStandardMaterial map={tex} roughness={0.6} metalness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (rnd() - 0.5) * 16;
      arr[i * 3 + 1] = (rnd() - 0.5) * 16;
      arr[i * 3 + 2] = (rnd() - 0.5) * 16;
    }
    return arr;
  }, []);
  return (
    <points rotation={[0, frame * 0.002, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8c98a" size={0.04} transparent opacity={0.7} />
    </points>
  );
};

const SceneContents: React.FC<{textures: THREE.Texture[]}> = ({textures}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / durationInFrames;
  // Camera dolly in, slight orbit
  const camZ = interpolate(t, [0, 1], [11, 7.5]);
  const camX = Math.sin(t * Math.PI) * 1.2;
  return (
    <>
      <color attach="background" args={["#0d0d0f"]} />
      <perspectiveCamera position={[camX, 0.8, camZ]} fov={45} near={0.1} far={100} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#fff3dc" />
      <pointLight position={[-4, -2, 3]} intensity={0.9} color="#e8c98a" />
      {textures.length > 0 && <PhotoRing textures={textures} />}
      <Particles />
    </>
  );
};

export const Scene3D: React.FC = () => {
  const textures = useTextures();
  const {width, height} = useVideoConfig();
  return (
    <div style={{width, height, position: "absolute", inset: 0}}>
      <ThreeCanvas width={width} height={height} linear shadows={false}>
        <SceneContents textures={textures} />
      </ThreeCanvas>
    </div>
  );
};
