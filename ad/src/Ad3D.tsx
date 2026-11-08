import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig} from "remotion";
import {Scene3D} from "./Scene3D";

const FONT = "'FreeSerif', 'DejaVu Sans', serif";
const GOLD = "#e8c98a";

const Title: React.FC<{text: string; size: number; color?: string; delay?: number; weight?: number}> = ({
  text, size, color = "#fff", delay = 0, weight = 700,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div style={{
      fontFamily: FONT, fontSize: size, color, fontWeight: weight, direction: "rtl", textAlign: "center",
      opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.96 + s * 0.04})`,
      textShadow: "0 6px 30px rgba(0,0,0,0.7)", lineHeight: 1.15,
    }}>{text}</div>
  );
};

const Caption: React.FC<{a: string; b?: string}> = ({a, b}) => (
  <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 240}}>
    <Title text={a} size={84} />
    {b && <div style={{height: 20}} />}
    {b && <Title text={b} size={50} color={GOLD} delay={10} weight={400} />}
  </AbsoluteFill>
);

const Intro: React.FC = () => (
  <AbsoluteFill style={{justifyContent: "center", alignItems: "center", background: "rgba(13,13,15,0.35)"}}>
    <Title text="חופות דוד" size={160} color={GOLD} />
    <div style={{height: 20}} />
    <Title text="הרב דוד אזולאי" size={58} delay={14} weight={400} />
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", background: `rgba(13,13,15,${0.6 * fade})`, gap: 34}}>
      <Title text="להזמנת תאריך" size={70} color={GOLD} />
      <Title text="055-971-1355" size={100} delay={10} />
      <Title text="hupatdavid.com" size={56} color={GOLD} delay={20} weight={400} />
    </AbsoluteFill>
  );
};

export const Ad3D: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#0d0d0f"}}>
      <Scene3D />
      <Sequence from={0} durationInFrames={90}><Intro /></Sequence>
      <Sequence from={150} durationInFrames={90}><Caption a="הרגע שהופך לזיכרון" b="לכל החיים" /></Sequence>
      <Sequence from={330} durationInFrames={90}><Caption a="הנחיית חופה מרגשת" b="לכל זוג, בכל מקום" /></Sequence>
      <Sequence from={510} durationInFrames={90}><Outro /></Sequence>
    </AbsoluteFill>
  );
};
