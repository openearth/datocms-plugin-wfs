import { Canvas } from "datocms-react-ui";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import PropertiesTable from "../components/PropertiesTable"


type Props = {
  ctx: RenderFieldExtensionCtx;
};


export default function IndexableWfsProperties({ ctx }: Props) {
  const updateSavedData = (data: string) => {
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(data))
  }
  
  return <Canvas ctx={ctx}><PropertiesTable formValues={ctx.formValues} updateSavedData={updateSavedData}/></Canvas>
}
