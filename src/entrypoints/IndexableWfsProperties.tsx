import { Canvas } from "datocms-react-ui";
import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import PropertiesTable from "../components/PropertiesTable"


type Props = {
  ctx: RenderFieldExtensionCtx;
};


export default function IndexableWfsProperties({ ctx }: Props) {
    
  //ctx.setFieldValue(ctx.fieldPath, JSON.stringify(defaultValues))
/*   console.log(ctx.formValues) */
  return <Canvas ctx={ctx}><PropertiesTable formValues={ctx.formValues}/></Canvas>
}


/* 


example json
[
  {
    "index": 4,
    "property": "naam",
    "worms": true,
    "keywords": [
      "k1",
      "k2"
    ]
  },
  {
    "index": 2,
    "property": "code",
    "worms": true,
    "keywords": [
      "k3",
      "k4"
    ]
  }
]

*/
