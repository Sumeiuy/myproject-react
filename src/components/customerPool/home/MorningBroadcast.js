/**
 * Created By K0170179 on 2018/1/11
 * 晨间播报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './morningBroadcast.less';
import Marquee from '../../morningBroadcast/Marquee';
import { openRctTab } from '../../../utils';
import { emp, url as urlHelper } from '../../../helper';
import more from './img/more.png';
import { request } from '../../../config';

export default class MorningBroadcast extends PureComponent {
  static propTypes = {
    dataList: PropTypes.array.isRequired,
    sourceList: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeMusic: '',
    };
  }

  onHandleListen(id) {
    this.setState({
      activeMusic: id,
    });
  }

  @autobind
  onHandleClose() {
    this.setState({
      activeMusic: '',
    });
  }

  @autobind
  openNewTab(url, query = {}) {
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '晨报' };
    const { push } = this.props;
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
    });
  }

  @autobind
  getAudioSrc(source) {
    return `${request.prefix}/file/ceFileDownload?attachId=${source.attachId}&empId=${emp.getId()}&filename=${source.name}`;
  }

  render() {
    const { dataList, sourceList = [] } = this.props;
    const { activeMusic } = this.state;
    return (
      <div className={styles.morning_broadcast}>
        <div className={styles.title}>
          <span>晨间播报</span>
          <span className={styles.more} onClick={() => this.openNewTab('/broadcastList')} >
            <span>更多</span>
            <img src={more} alt="" />
          </span>
        </div>
        <div className={styles.listWrap}>
          {
            dataList
              .map((item, index) => {
                if (activeMusic === item.newsId) {
                  const sourceFile = sourceList[index];
                  const audioSrc = sourceFile && this.getAudioSrc(sourceFile);
                  return (
                    <div key={item.newsId} className={styles.item}>
                      <div className={styles.simpleName}>
                        <Marquee content={item.newsTypValue} speed={40} />
                      </div>
                      <div className={styles.music}>
                        <audio src={audioSrc} controls="controls" autoPlay >
                          Your browser does not support the audio element.
                        </audio>
                        <Icon onClick={this.onHandleClose} className={styles.close} type="close-circle" />
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={item.newsId} className={styles.item}>
                    <span className={styles.desc}>{`${item.newsTypValue}：${item.title}`}</span>
                    <span
                      onClick={() => { this.onHandleListen(item.newsId); }}
                      className={styles.listen}
                    >收听</span>
                  </div>
                );
              })
          }
        </div>
      </div>
    );
  }
}
