declare module "*.png" {
  const value: any;
  export default value;
}
declare module "*.jpg" {
  const value: any;
  export default value;
}
declare module "*.svg" {
  import { FC } from "react";
  import { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}
