import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from '../utils/three';
import { getHouseName } from '../utils/fluidAstrologyMappings';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_LAYERS = {
  Aries: [
    { src: "figma:asset/1fbe0d46a30d48090e15a649a660a11c5e327ab3.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/c9b81f6c5eeec33acb49f3461c1e5306dc409728.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/ec2753c1d0f1a02231a157e0283e104c4d040bfc.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/5dd571ace9411165e77a40706fa50f1f668439a8.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/43b358fd39bf408b72e9a550b5faa12b9713f187.png", blend: 'normal', opacity: 0.5 },
  ],
  Taurus: [
    { src: "figma:asset/7e833006eca3824aa135892c53a0aec9465349fb.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/47fb529613ac9967b223387cf64da8a5cf456945.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/3ac03a22a9432f5b299ac70b84ffefa7224ad6a2.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/fff96255b30a1f3232093636915ab1a3a9fd1dbd.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/c4461a0907f813cc66feebef32be34dfe8d02de0.png", blend: 'normal', opacity: 0.5 },
  ],
  Gemini: [
    { src: "figma:asset/2ad86018724a3b2ec7f24c8be8bc25e8a8e83784.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/58dc2504f1830bf8659572af0aef510e7a20d972.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/790c0a316b74b56f877ed67e5756beb0ecb2bd21.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/11503119abf6e9ec9cd03d51f590a2118bde676d.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/1182d27187cf7ba2c0d275462483d1f7c2c11469.png", blend: 'normal', opacity: 0.5 },
  ],
  Cancer: [
    { src: "figma:asset/55a77eca5ce1630a17edce1c38358f9f005d59cb.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/4079c57768e365a6d340efa9dac8b66d4849d07a.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/4194dc0761d0f84be0a82533919ad483b05eb330.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/17f7812ec2c87c958b169b0d65c9ee0339dde6eb.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/e9478ee04b3f1126969de750e00cf41935c5dd5d.png", blend: 'normal', opacity: 0.5 },
  ],
  Leo: [
    { src: "figma:asset/06b4b0c9c08fba0f6f3b8af32a5c1c795fb54d9c.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/c9b81f6c5eeec33acb49f3461c1e5306dc409728.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/ff16fa5225650e2d4bb0e51acfb0229bfcb06830.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/da02629c94f0cd5df5a872fa6dc8827c275527f5.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/89727f9ac96a06f7fc6a38c317aa1af6b3604aef.png", blend: 'normal', opacity: 0.5 },
  ],
  Virgo: [
    { src: "figma:asset/7e833006eca3824aa135892c53a0aec9465349fb.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/61921cb1f6b7d2e5c397bbad0802ae035e5d8ada.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/7e0e7966a0f2d66373de1ecb6b88b2d7d7e77e35.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/c14071a84ca93427a07a711e8540163395bbd2dd.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/a3961554715e219639edc9b4603e04ebd223240c.png", blend: 'normal', opacity: 0.5 },
  ],
  Libra: [
    { src: "figma:asset/2ad86018724a3b2ec7f24c8be8bc25e8a8e83784.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/35180a39096fb0bb80ae7b0dd5ff0eaf9f88e75a.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/3ac03a22a9432f5b299ac70b84ffefa7224ad6a2.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/2497f87c65bc93d2d9ae0d628683ef3e3a75bcdd.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/80a3cb2f3c284270f7ef7313ce58a18adbbccc95.png", blend: 'normal', opacity: 0.5 },
  ],
  Scorpio: [
    { src: "figma:asset/646049dcab2843b01f20ed53fcb5b0143ac9007f.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/1494e97187dfe43e188c9c90043d93bfb6188000.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/4194dc0761d0f84be0a82533919ad483b05eb330.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/41bb6132facc4497d71b93c4e8552dfa24226a11.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/291664748fef3a3042f175815786c70a374db29c.png", blend: 'normal', opacity: 0.5 },
  ],
  Sagittarius: [
    { src: "figma:asset/06b4b0c9c08fba0f6f3b8af32a5c1c795fb54d9c.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/c9b81f6c5eeec33acb49f3461c1e5306dc409728.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/ec2753c1d0f1a02231a157e0283e104c4d040bfc.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/5dd571ace9411165e77a40706fa50f1f668439a8.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/c12c4b953810794aa11351e37e9c117615931ffa.png", blend: 'normal', opacity: 0.5 },
  ],
  Capricorn: [
    { src: "figma:asset/7e833006eca3824aa135892c53a0aec9465349fb.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/61921cb1f6b7d2e5c397bbad0802ae035e5d8ada.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/7e0e7966a0f2d66373de1ecb6b88b2d7d7e77e35.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/2497f87c65bc93d2d9ae0d628683ef3e3a75bcdd.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/fdb33686b0f02d6e33ee3aa8bf98da8ebc85d2d3.png", blend: 'normal', opacity: 0.5 },
  ],
  Aquarius: [
    { src: "figma:asset/2ad86018724a3b2ec7f24c8be8bc25e8a8e83784.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/6f77e7af76565af30c61ef79c31271bc2d253c3d.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/790c0a316b74b56f877ed67e5756beb0ecb2bd21.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/d21417d2e7fb22570735ef8d35066744b31a22c9.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/0ddce0576b0983b54983b5269aa65bb589f19381.png", blend: 'normal', opacity: 0.5 },
  ],
  Pisces: [
    { src: "figma:asset/55a77eca5ce1630a17edce1c38358f9f005d59cb.png", blend: 'normal', opacity: 1 },
    { src: "figma:asset/4079c57768e365a6d340efa9dac8b66d4849d07a.png", blend: 'soft-light', opacity: 0.6 },
    { src: "figma:asset/4aeb2bdeef3b19194c07924846280e05e801c112.png", blend: 'multiply', opacity: 0.4 },
    { src: "figma:asset/d600492cdcb02032960c2da83df3b2b5232a12fc.png", blend: 'soft-light', opacity: 0.4 },
    { src: "figma:asset/0303cda1464d121c8759e296003497ab2b73aab1.png", blend: 'normal', opacity: 0.5 },
  ],
};

// 3D Background Component for use inside Canvas
export function ZodiacBackground3D({ houseIndex }: { houseIndex: number | null }) {
  if (houseIndex === null) return null;

  const zodiacSign = ZODIAC_SIGNS[houseIndex];
  const layers = ZODIAC_LAYERS[zodiacSign as keyof typeof ZODIAC_LAYERS];

  return (
    <Suspense fallback={null}>
      <group>
        {layers.map((layer, i) => (
          <BackgroundLayer 
            key={i}
            src={layer.src}
            opacity={layer.opacity}
            delay={i * 0.15}
            radius={40 - i * 0.5} // Each layer slightly smaller for depth
          />
        ))}
      </group>
    </Suspense>
  );
}

// Individual background layer as a 3D sphere (skybox)
function BackgroundLayer({ 
  src, 
  opacity, 
  delay,
  radius
}: { 
  src: string; 
  opacity: number; 
  delay: number;
  radius: number;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    loader.load(
      src,
      (loadedTexture) => {
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (err) => {
        console.warn('Failed to load texture:', src, err);
        setError(true);
      }
    );

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [src]);

  if (error || !texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial 
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.BackSide} // Render on inside of sphere
        depthWrite={false}
      />
    </mesh>
  );
}

// 2D DOM overlay for sign name (keep this separate)
interface ZodiacBackgroundProps {
  houseIndex: number | null;
}

export function ZodiacBackgroundOverlay({ houseIndex }: ZodiacBackgroundProps) {
  // This overlay is no longer needed - house name is shown in HouseLayerOverlay
  return null;
}