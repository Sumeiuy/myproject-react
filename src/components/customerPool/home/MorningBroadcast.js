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
import Audio from '../../common/audio/Audio';
import { openRctTab } from '../../../utils';
import withRouter from '../../../decorators/withRouter';
import { emp, url as urlHelper } from '../../../helper';
import more from './img/more.png';
import { request } from '../../../config';

@withRouter
export default class MorningBroadcast extends PureComponent {
  static propTypes = {
    dataList: PropTypes.array.isRequired,
    sourceList: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    queryAudioFile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeMusic: '',
    };
  }

  @autobind
  onListen(newsId, audioFileId) {
    const { queryAudioFile } = this.props;
    queryAudioFile({ newsId, audioFileId });
    this.setState({
      activeMusic: newsId,
    });
  }

  @autobind
  onHandleClose() {
    this.setState({
      activeMusic: '',
    });
  }

  @autobind
  openNewTab(url) {
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_LIST', title: '晨报' };
    const query = { isInit: true };
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
    return `${request.prefix}/file/ceFileDownload?attachId=${source.attachId}&empId=${emp.getId()}&filename=${window.encodeURIComponent(source.name)}`;
  }

  // 跳转至晨报详情
  @autobind
  handleToDetail(newsId) {
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_LIST', title: '晨报' };
    const url = '/broadcastDetail';
    const query = { newsId };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
    });
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
              .map((item) => {
                const {
                  newsId,
                  newsTypValue,
                  title,
                  audioFileId,
                } = item;
                if (activeMusic === item.newsId) {
                  const sourceFile = sourceList[newsId];
                  const audioSrc = sourceFile && this.getAudioSrc(sourceFile);
                  return (
                    <div key={newsId} className={styles.item}>
                      <div
                        className={styles.simpleName}
                      >
                        <Marquee content={`${newsTypValue}：${title}`} speed={40} />
                      </div>
                      <div className={styles.music}>
                        <Audio src={audioSrc} autoPlay />
                        <Icon onClick={this.onHandleClose} className={styles.close} type="close-circle" />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={newsId}
                    className={styles.item}
                  >
                    <span
                      className={styles.desc}
                      onClick={() => { this.handleToDetail(newsId); }}
                      title={title}
                    >
                      {`${newsTypValue}：${title}`}
                    </span>
                    <span
                      onClick={() => { this.onListen(newsId, audioFileId); }}
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
