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
        type: 'editor', // other option is addon. Addon is used to add information to the field.
        fieldTypes: [
          'json' // we want to attach it only to a json field type
        ],
      },
    ];
  },
  renderFieldExtension(id, ctx) {
    render(<IndexableWfsProperties ctx={ctx} />);
  },

});
