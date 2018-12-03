/**
 * @Author: sunweibin
 * @Date: 2018-06-08 16:42:34
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-08 17:39:57
 * @description 投资建议模板内容展示
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Popover } from 'antd';

import { dom } from '../../../helper';

import styles from './taskBindTemplateModal.less';

export default class TemplateContent extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    getPopupContainer: PropTypes.func.isRequired,
    visiblePopover: PropTypes.bool.isRequired,
    tempLiateId: PropTypes.string.isRequired,
    onPopoverVisibleChange: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      visiblePopover: nextProps.visiblePopover,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      visibleMore: false,
      visiblePopover: false,
    };
  }

  componentDidMount() {
    this.setMoreBtnVisible();
  }

  @autobind
  setMoreBtnVisible() {
    if (this.cardBodyRef) {
      const height = Number.parseInt(dom.getCssStyle(this.cardBodyRef, 'height'), 10);
      // 判断模板内容高度是否超过了3行文字，目前每一行的line-height为24px
      const threeLineHeight = 24 * 3;
      const isOverThreeLineHeight = height > threeLineHeight;
      this.setState({
        visibleMore: isOverThreeLineHeight,
      });
    }
  }

  @autobind
  setCardBodyRef(input) {
    this.cardBodyRef = input;
  }

  @autobind
  handlePopoverVisibleChange(visible) {
    const { tempLiateId } = this.props;
    this.props.onPopoverVisibleChange(tempLiateId, visible);
  }

  render() {
    const { content, getPopupContainer } = this.props;
    const { visibleMore, visiblePopover } = this.state;
    return (
      <div className={styles.cardBody} ref={this.setCardBodyRef}>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={content} // eslint-disable-line
        />
        {
          !visibleMore ? null
            : (
              <Popover
                visible={visiblePopover}
                onVisibleChange={this.handlePopoverVisibleChange}
                getPopupContainer={getPopupContainer}
                trigger="click"
                placement="topRight"
                content={(
                  <div
                    className={styles.popoverContent}
                    dangerouslySetInnerHTML={content}
                  />
)}
              >
                <div className={styles.more}>[更多]</div>
              </Popover>
            )
        }
      </div>
    );
  }
}
