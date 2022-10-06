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


/* 


example json
[
  {
    "indexed": true,
    "property": "naam",
    "worms": false,
    "keywords": [
      "k1",
      "k2"
    ]
  },
  {
    "indexed": true,
    "property": "code",
    "worms": true,
    "keywords": [
      "k3",
      "k4"
    ]
  }
]

*/
