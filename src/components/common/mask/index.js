/*
 * @Description: 遮罩层
 * @Author: WangJunjun
 * @Date: 2018-05-16 11:58:54
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-16 15:04:54
 */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import style from './index.less';

export default class Mask extends React.Component {

  constructor(props) {
    super(props);
    this.state = { visible: props.visible };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setState({ visible: nextProps.visible });
    }
  }

  render() {
    const { visible } = this.state;
    const maskCls = cx(style.mask, {
      [style.invisibility]: !visible,
    });
    return ReactDOM.createPortal(
      <div className={maskCls} />,
      document.body,
    );
  }
}

Mask.propTypes = {
  visible: PropTypes.bool,
};
Mask.defaultProps = {
  visible: false,
};
