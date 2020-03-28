import * as React from "react";
import { Bubble } from "./OPBubbles4";

const style: React.CSSProperties = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#8855FF",
  background: "rgba(136, 85, 255, 0.1)",
  overflow: "hidden",
};

// Define type of property
interface Props {
  text: string;
}

export class OPFunction extends React.Component<Props> {
  // Set default properties
  static defaultProps = {
    text: "Hello World!",
  };

  // Items shown in property panel
  static propertyControls = {
    text: { type: "string" as any, title: "Text" },
  };

  render() {
    return (
      <>
        <Bubble color="blue" />
      </>
    );

    // return <OPBubbles4 width="100%" height="100%" />;
  }
}
