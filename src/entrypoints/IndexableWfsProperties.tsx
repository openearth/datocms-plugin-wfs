import { Canvas } from "datocms-react-ui";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import PropertiesTable from "../components/PropertiesTable"

type Props = {
  ctx: RenderFieldExtensionCtx;
};


export default function IndexableWfsProperties({ ctx }: Props) {
  console.log(ctx.fieldPath)
  return <Canvas ctx={ctx}><PropertiesTable formValues={ctx.formValues}/></Canvas>
}


