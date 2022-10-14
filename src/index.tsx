import { connect } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import IndexableWfsProperties from './entrypoints/IndexableWfsProperties';
import 'datocms-react-ui/styles.css';

connect({
  manualFieldExtensions() {
    return [
      {
        id: 'indexableWfsProperties',
        name: 'Indexable WFS Properties',
        type: 'editor', 
        fieldTypes: [
          'json' 
        ],
      },
    ];
  },
  renderFieldExtension(id, ctx) {
    render(<IndexableWfsProperties ctx={ctx} />);
  },

});
