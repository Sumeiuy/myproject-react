import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FspCutScreen from './fspCutScreen';
import OldCutScreen from './oldCutScreen';
import { env } from '../../../helper';

export default class CutScreen extends PureComponent {
  static propTypes = {
    topPanel: PropTypes.element.isRequired,
    leftPanel: PropTypes.element.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    rightPanel: PropTypes.element,
    leftListClassName: PropTypes.string,
    leftWidth: PropTypes.number,
  }

  static defaultProps = {
    leftListClassName: 'pageCommonList',
    rightPanel: null,
    leftWidth: 520,
  }

  render() {
    const props = this.props;
    return (
      env.isInFsp() ?
        <OldCutScreen {...props} /> :
        <FspCutScreen {...props} />
    );
  }
}
