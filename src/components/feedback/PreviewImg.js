/*
 * @Description:  图片预览
 * @Author: 张俊丽
 * @Date: 2018-06-11 14:49:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import { Modal } from 'antd';

import { request } from '../../config';
import logable, { logCommon } from '../../decorators/logable';
import Icon from '../common/Icon';
import styles from './previewImg.less';

export default class PreviewImg extends PureComponent {
  static propTypes = {
    previewUrl: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    icon: '',
    previewUrl: '',
    label: '查看',
    className: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      imgHeight: 0,
      imgWidth: 0,
      visible: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentDidUpdate(preProps) {
    const { previewUrl } = this.props;
    const { previewUrl: preUrl } = preProps;
    const {
      imgHeight: height,
      imgWidth: width,
    } = this.state;
    // 请求图片大小
    if ((!height && !width) || (preUrl !== previewUrl && previewUrl)) {
      const newImg = new Image();
      newImg.onload = () => {
        const imgHeight = newImg.height;
        const imgWidth = newImg.width;
        this.setState(
          { imgHeight, imgWidth },
          this.calculateRealSize,
        );
      };
      // this must be done AFTER setting onload
      newImg.src = `${request.prefix}${previewUrl}`;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
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
  @logable({ type: 'Click', payload: { name: '预览' } })
  handlePreview() {
    this.setState({
      visible: true,
    });
    // log日志，缩略图预览
    logCommon({
      type: 'Click',
      payload: {
        name: '缩略图预览',
      },
    });
  }

  @autobind
  renderPreview() {
    const { icon, label, className } = this.props;
    const hasIcon = !_.isEmpty(icon);
    return (
      <div
        className={classnames(
          styles.preview,
          { [className]: !!className },
        )}
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
    const { visible, newWidth } = this.state;
    const { previewUrl } = this.props;

    return (
      <div>
        {this.renderPreview()}
        <Modal
          visible={visible}
          width={newWidth}
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
