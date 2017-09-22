/**
 * @file MessageList.js
 * author shenxuxiang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from '../InfoTitle';
import TextLayout from '../textlayout';
import style from './messagelist.less';

export default class MessageList extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    baseInfo: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
    })),
  }

  static defaultProps = {
    baseInfo: [],
  }

  get eleMap() {
    const result = this.props.baseInfo.map((item, index) => {
      const tabIndex = `MgsList${index}`;
      return (
        <TextLayout key={tabIndex} {...item} />
      );
    });
    return result;
  }

  render() {
    const { head } = this.props;
    return (
      <div className={style.messageListComponent}>
        <InfoTitle head={head} />
        <div className={style.mlcContent}>
          {this.eleMap}
        </div>
      </div>
    );
  }
}

