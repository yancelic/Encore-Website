import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from 'raea';
import { Entity } from 'raea/3d';
import { Camera3d } from 'raea/camera';
import { Mesh3d, Cuboid, Cylinder, Cone } from 'raea/mesh';
import { StandardMaterial } from 'raea/pbr';
import { AmbientLight, DirectionalLight } from 'raea/light';
import { Transform, Quat } from 'raea/transform';

const ink = '#0c120c', red = '#c20114', slate = '#5d737e', sky = '#bfd5e2', white = '#ecebf3';
const wrap = (n: number, m: number) => ((n % m) + m) % m;
function Box({ name, at, size, color, rotation = 0 }: { name: string; at: number[]; size: number[]; color: string; rotation?: number }) {
  return <Mesh3d name={name} allowOverlap={name.startsWith('hero-') || name.startsWith('rival-')} transform={Transform.fromXyz(at[0], at[1], at[2]).withRotation(Quat.fromEuler('XYZ', 0, rotation, 0))}>
    <Cuboid half_size={[size[0] / 2, size[1] / 2, size[2] / 2]} />
    <StandardMaterial base_color={color} perceptual_roughness={.75} />
  </Mesh3d>;
}
function Car({ name, x, z, yaw, spin, color }: {name:string;x:number;z:number;yaw:number;spin:number;color:string}) {
  return <Entity transform={Transform.fromXyz(x, .03 + Math.sin(spin * .12) * .015, z).withRotation(Quat.fromEuler('XYZ', 0, yaw, -yaw * .16))}>
    <Box name={`${name}-body`} at={[0,.48,0]} size={[1.9,.46,3.8]} color={color}/>
    <Box name={`${name}-cabin`} at={[0,.91,.15]} size={[1.58,.6,1.65]} color={color}/>
    <Box name={`${name}-glass-back`} at={[0,.97,1]} size={[1.4,.4,.025]} color={ink}/>
    <Box name={`${name}-glass-front`} at={[0,1.01,-.69]} size={[1.4,.35,.03]} color={sky}/>
    <Box name={`${name}-roof-stripe`} at={[0,1.217,.15]} size={[.24,.018,1.65]} color={white}/>
    <Box name={`${name}-hood-stripe`} at={[0,.72,-1.23]} size={[.24,.018,1.23]} color={white}/>
    <Box name={`${name}-trunk-stripe`} at={[0,.72,1.47]} size={[.24,.018,.75]} color={white}/>
    <Box name={`${name}-bumper`} at={[0,.32,1.94]} size={[1.9,.19,.12]} color={ink}/>
    <Box name={`${name}-spoiler`} at={[0,1.04,1.6]} size={[2,.12,.4]} color={ink}/>
    <Box name={`${name}-spoiler-post-l`} at={[-.65,.84,1.6]} size={[.1,.4,.1]} color={ink}/>
    <Box name={`${name}-spoiler-post-r`} at={[.65,.84,1.6]} size={[.1,.4,.1]} color={ink}/>
    <Box name={`${name}-rear-panel`} at={[0,.53,1.914]} size={[1.7,.15,.025]} color={ink}/>
    <Box name={`${name}-lamp-l`} at={[-.61,.57,1.94]} size={[.42,.09,.04]} color={red}/>
    <Box name={`${name}-lamp-r`} at={[.61,.57,1.94]} size={[.42,.09,.04]} color={red}/>
    <Box name={`${name}-plate`} at={[0,.37,2.01]} size={[.38,.12,.02]} color={white}/>
    {[-1,1].flatMap(side=>[-1.15,1.2].map((long,i)=><Entity key={`${side}-${i}`} transform={Transform.fromXyz(side*.96,.36,long)}>
      <Mesh3d name={`${name}-wheel-${side}-${i}`} allowOverlap transform={Transform.IDENTITY.withRotation(Quat.fromEuler('XYZ',spin,0,Math.PI/2))}>
        <Cylinder radius={.36} half_height={.16}/><StandardMaterial base_color={ink} perceptual_roughness={1}/>
      </Mesh3d>
      <Mesh3d name={`${name}-hub-${side}-${i}`} allowOverlap transform={Transform.fromXyz(side*.17,0,0).withRotation(Quat.fromEuler('XYZ',spin,0,Math.PI/2))}>
        <Cylinder radius={.21} half_height={.012}/><StandardMaterial base_color={slate} metallic={.4} perceptual_roughness={.4}/>
      </Mesh3d>
      <Box name={`${name}-spoke-${side}-${i}`} at={[side*.187,0,0]} size={[.02,.055,.4]} color={white} rotation={spin}/>
    </Entity>))}
  </Entity>;
}
function Replay() {
  const f = useCurrentFrame(), t = f / 30, phase = t * Math.PI * 2 / 30;
  const lateral = Math.sin(phase * 2) * 1.45 + Math.sin(phase * 4) * .23;
  const roadOffset = wrap(t * 24, 8);
  return <AbsoluteFill style={{background:sky}}>
    <Camera3d transform={Transform.fromXyz(lateral * .32,3.1,7.1).lookingAt([lateral*.5,.7,-6])} projection={{Perspective:{fov: .92}}}/>
    <AmbientLight brightness={220}/>
    <DirectionalLight transform={Transform.fromXyz(-25,40,15).lookingAt([0,0,-10])} illuminance={10000} shadow_maps_enabled/>
    <Box name="ground" at={[0,-.23,-60]} size={[300,.4,200]} color={slate}/>
    <Box name="road" at={[0,-.005,-60]} size={[13,.06,200]} color={ink}/>
    {Array.from({length:18},(_,i)=>{
      const z=-128+i*8+roadOffset;
      return <Entity key={`lane-${i}`} transform={Transform.IDENTITY}>
        <Box name={`lane-${i}`} at={[0,.035,z]} size={[.12,.025,3.6]} color={white}/>
        {[-1,1].map(side=><Entity key={side} transform={Transform.IDENTITY}>
          <Box name={`curb-${i}-${side}`} at={[side*6.35,.05,z]} size={[.6,.12,4]} color={red}/>
          <Box name={`curb-white-${i}-${side}`} at={[side*6.35,.05,z+4]} size={[.6,.12,4]} color={white}/>
          <Box name={`rail-${i}-${side}`} at={[side*7.15,.6,z]} size={[.16,.18,8]} color={sky}/>
          <Box name={`post-${i}-${side}`} at={[side*7.15,.3,z]} size={[.14,.6,.14]} color={ink}/>
        </Entity>)}
      </Entity>;
    })}
    {Array.from({length:18},(_,i)=>{
      const z=-160+wrap(i*10+t*24,180), side=i%2===0?-1:1, height=5+(i*7%11);
      return <Entity key={`scenery-${i}`} transform={Transform.IDENTITY}>
        <Mesh3d name={`mountain-${i}`} transform={Transform.fromXyz(side*(20+i%3*7),height/2-1,z)}>
          <Cone radius={8+i%4*3} height={height}/><StandardMaterial base_color={i%3===0?sky:slate} perceptual_roughness={1}/>
        </Mesh3d>
        <Box name={`marker-${i}`} at={[side*9,1,z]} size={[.4,2,.4]} color={white}/>
        <Box name={`marker-red-${i}`} at={[side*9,1.7,z]} size={[.42,.4,.42]} color={red}/>
      </Entity>;
    })}
    <Car name="rival" x={-2.5} z={-45+wrap(t*2.4,72)} yaw={.015} spin={t*23} color={sky}/>
    <Car name="hero" x={lateral} z={0} yaw={Math.cos(phase*2)*.12+Math.cos(phase*4)*.025} spin={t*32} color={red}/>
  </AbsoluteFill>;
}
registerRoot(()=> <Composition id="encore-replay" component={Replay} width={960} height={540} fps={30} durationInFrames={900}/>);
