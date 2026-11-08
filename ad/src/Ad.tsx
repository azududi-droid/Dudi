import React from "react";
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig} from "remotion";

const FONT = "'FreeSerif', 'DejaVu Sans', serif";
const GOLD = "#e8c98a";
const DARK = "#0d0d0f";

const photos = ["p1.jpg", "p2.jpg", "p3.jpg", "p4.jpg", "p5.jpg", "p6.jpg", "p7.jpg"];

// Slow zoom + fade for each photo
const PhotoScene: React.FC<{src: string; dur: number}> = ({src, dur}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1.0, 1.12]);
  const opacity = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{opacity}}>
      <Img
        src={staticFile(src)}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.65))"}} />
    </AbsoluteFill>
  );
};

const Line: React.FC<{text: string; size: number; color?: string; delay?: number; weight?: number}> = ({
  text, size, color = "#fff", delay = 0, weight = 700,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        color,
        fontWeight: weight,
        direction: "rtl",
        textAlign: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        lineHeight: 1.2,
        textShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};

const Intro: React.FC = () => (
  <AbsoluteFill style={{background: DARK, justifyContent: "center", alignItems: "center", gap: 30}}>
    <Line text="חופות דוד" size={150} color={GOLD} delay={0} />
    <Line text="הרב דוד אזולאי" size={60} color="#fff" delay={12} weight={400} />
  </AbsoluteFill>
);

const Message: React.FC<{a: string; b: string}> = ({a, b}) => (
  <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 260, padding: 60}}>
    <Line text={a} size={86} delay={0} />
    <div style={{height: 24}} />
    <Line text={b} size={52} color={GOLD} delay={10} weight={400} />
  </AbsoluteFill>
);

const Outro: React.FC = () => (
  <AbsoluteFill style={{background: DARK, justifyContent: "center", alignItems: "center", gap: 36}}>
    <Line text="להזמנת תאריך" size={70} color={GOLD} delay={0} />
    <Line text="055-971-1355" size={96} delay={10} />
    <Line text="hupatdavid.com" size={56} color={GOLD} delay={20} weight={400} />
  </AbsoluteFill>
);

export const Ad: React.FC = () => {
  // 30fps. Timeline (frames): intro 0-90, photos 90-510 (7 x 60), message blocks, outro 510-600
  const perPhoto = 60;
  return (
    <AbsoluteFill style={{background: DARK}}>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>

      {photos.map((src, i) => (
        <Sequence key={src} from={90 + i * perPhoto} durationInFrames={perPhoto}>
          <PhotoScene src={src} dur={perPhoto} />
        </Sequence>
      ))}

      <Sequence from={120} durationInFrames={90}>
        <Message a="הרגע שהופך לזיכרון" b="לכל החיים" />
      </Sequence>
      <Sequence from={300} durationInFrames={90}>
        <Message a="הנחיית חופה מרגשת" b="לכל זוג, בכל מקום" />
      </Sequence>

      <Sequence from={510} durationInFrames={90}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
