/**
 * @file MessageList.js
 * author shenxuxiang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfoTitle from './InfoTitle';
import style from './messagelist.less';

export default class MessageList extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
    })),
  }

  static defaultProps = {
    content: [],
  }

  get getEleMap() {
    const result = this.props.content.map((item, index) => {
      const tabIndex = `MgsList${index}`;
      return (
        <li
          key={tabIndex}
          className={style.mlcContentList}
        >
          <span className={style.mlcContentListTitle}>{item.title}</span>
          <span className={style.mlcContentListCon}>{item.content}</span>
        </li>
      );
    });
    return result;
  }

  render() {
    const { head } = this.props;
    return (
      <div className={style.messageListComponent}>
        <InfoTitle head={head} />
        <ul className={style.mlcContent}>
          {this.getEleMap}
        </ul>
      </div>
    );
  }
}

