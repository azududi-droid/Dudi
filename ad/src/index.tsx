import React from "react";
import {registerRoot, Composition} from "remotion";
import {Ad} from "./Ad";

const Root: React.FC = () => (
  <Composition
    id="HupotDavid"
    component={Ad}
    durationInFrames={30 * 20}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
