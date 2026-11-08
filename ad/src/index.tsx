import React from "react";
import {registerRoot, Composition} from "remotion";
import {Ad3D} from "./Ad3D";

const Root: React.FC = () => (
  <Composition id="HupotDavid3D" component={Ad3D} durationInFrames={30 * 20} fps={30} width={1080} height={1920} />
);

registerRoot(Root);
