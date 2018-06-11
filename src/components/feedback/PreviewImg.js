/*
 * @Description:  图片预览
 * @Author: 张俊丽
 * @Date: 2018-06-11 14:49:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';

import { request } from '../../config';
import Icon from '../common/Icon';
import styles from './previewImg.less';

const width = 520;

export default class PreviewImg extends PureComponent {
  static propTypes = {
    previewUrl: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
  }

  static defaultProps = {
    icon: '',
    previewUrl: '',
    label: '查看',
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  /**
   * 设置弹出框图片的宽度和高度
   * @param {*} newHeight 新的高度
   * @param {*} newWidth 新的宽度
   */
  setDOMStyle(newHeight, newWidth) {
    /* eslint-disable */
    const modalElem = ReactDOM.findDOMNode(document.querySelector('.imgModal'));
    if (modalElem) {
      const childrenElem = modalElem.children[0];
      dom.setStyle(modalElem, 'height', `${newHeight}px`);
      dom.setStyle(modalElem, 'width', `${newWidth}px`);
      dom.setStyle(modalElem, 'margin', 'auto');
      dom.setStyle(modalElem, 'overflow', 'hidden');
      dom.setStyle(childrenElem, 'top', '50%');
      dom.setStyle(childrenElem, 'marginTop', `-${newHeight / 2}px`);
      dom.setStyle(childrenElem, 'paddingBottom', '0px');
    }
  }

  /**
 * 计算图片在页面需要展示的宽度，并设置弹框样式
 */
  calculateRealSize() {
    const containerHeight = document.documentElement.clientHeight - (50 * 2);
    const containerWidth = document.documentElement.clientWidth - (100 * 2);
    const { imgHeight, imgWidth } = this.state;
    let w = imgWidth;
    let h = imgHeight;
    const hRatio = containerHeight / h;
    const wRatio = containerWidth / w;
    let Ratio = 1;
    if (containerWidth === 0 && containerHeight === 0) {
      Ratio = 1;
    } else if (containerWidth === 0) {
      if (hRatio < 1) { Ratio = hRatio; }
    } else if (containerHeight === 0) {
      if (wRatio < 1) { Ratio = wRatio; }
    } else if (wRatio < 1 || hRatio < 1) {
      Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
      w *= Ratio;
      h *= Ratio;
    }
    this.setState({
      newHeight: h,
      newWidth: w,
    }, () => {
      this.setDOMStyle(h, w);
    });
  }

  @autobind
  handleResize() {
    const { visible } = this.state;
    if (visible) {
      this.calculateRealSize();
    }
  }

  @autobind
  handlePreviewCancel() {
    this.setState({
      visible: false,
    });
  }

  @autobind
  handlePreview() {
    this.setState({
      visible: true,
    });
  }

  @autobind
  renderPreview() {
    const { icon, label } = this.props;
    const hasIcon = !_.isEmpty(icon);
    return (
      <div
        className={styles.preview}
        onClick={this.handlePreview}
      >
        <a>
          {
            hasIcon ? (
              <Icon type={icon} />
            ) : null
          }
           {label}
        </a>
      </div>
    );
  }

  render() {
    const { visible } = this.state;
    const { previewUrl } = this.props;

    return (
      <div>
        {this.renderPreview()}
        <Modal
          visible={visible}
          width={width}
          footer={null}
          onCancel={this.handlePreviewCancel}
          wrapClassName={styles.imgModal}
        >
          <img
            alt="图片"
            style={{ width: '100%' }}
            src={`${request.prefix}${previewUrl}`}
          />
        </Modal>
      </div>
    );
  }
}
