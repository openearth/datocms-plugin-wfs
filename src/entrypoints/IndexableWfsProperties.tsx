import { Canvas } from "datocms-react-ui";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import PropertiesTable from "../components/PropertiesTable"

type Props = {
  ctx: RenderFieldExtensionCtx;
};


export default function IndexableWfsProperties({ ctx }: Props) {
  return <Canvas ctx={ctx}><PropertiesTable/></Canvas>
}


