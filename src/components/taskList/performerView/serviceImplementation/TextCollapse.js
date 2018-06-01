import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../../../common/Icon';
import styles from './textCollapse.less';

import { dom as DOMHelper } from '../../../../helper';

export default class TextCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnVisible: true,
      fold: false,
    };
  }

  componentDidMount() {
    this.setHeight();
  }

  @autobind
  setHeight() {
    if (this.domNode) {
      const { minHeight, maxHeight } = this.props;
      const contentHeight = this.getDOMHeight(this.domNode);
      // 内容区域的高度大于行高*打点行数
      if (contentHeight > parseInt(minHeight, 10)) {
        this.setState({
          btnVisible: true,
        }, () => {
          this.domNode.style.height = minHeight;
        });
      } else {
        this.setState({
          btnVisible: false,
        }, () => {
          this.domNode.style.height = maxHeight;
        });
      }
    }
  }

  /**
   * 获取dom的高度
   * @param {*node} dom dom对象
   */
  @autobind
  getDOMHeight(dom) {
    return parseInt(DOMHelper.getCssStyle(dom, 'height'), 10);
  }

  // 展开收起按钮点击事件
  @autobind
  handleClick() {
    const { fold } = this.state;
    const { minHeight, maxHeight } = this.props;
    this.setState({
      fold: !fold,
    }, () => {
      this.domNode.style.height = !fold ? maxHeight : minHeight;
    });
  }

  @autobind
  saveRef(ref) {
    if (ref) {
      this.domNode = ref;
    }
  }

  render() {
    const { children, buttonStyle } = this.props;
    const { btnVisible, fold } = this.state;
    return (
      <div className={styles.container}>
        <div
          className={styles.contentWrapper}
          ref={this.saveRef}
        >
          {children}
        </div>
        {
          btnVisible &&
          <div className={styles.btnWrapper}>
            <Icon
              type={fold ? 'shouqi2' : 'zhankai1'}
              className={styles.icon}
              style={buttonStyle}
              onClick={this.handleClick}
            />
          </div>
        }
      </div>
    );
  }
}

TextCollapse.propTypes = {
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.string.isRequired,
  maxHeight: PropTypes.string.isRequired,
  buttonStyle: PropTypes.object,
};

TextCollapse.defaultProps = {
  buttonStyle: {},
};
