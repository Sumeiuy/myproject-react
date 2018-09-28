/**
 * Created By K0170179 on 2018/1/11
 * 晨间播报
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */

import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Marquee from '../../morningBroadcast/Marquee';
import Audio from '../../common/audio/Audio';
import { openRctTab } from '../../../utils';
import withRouter from '../../../decorators/withRouter';
import { emp, url as urlHelper } from '../../../helper';
import more from './img/more.png';
import { request } from '../../../config';
import logable from '../../../decorators/logable';

import styles from './morningBroadcast.less';
import classes from './morningBroadcast__.less';

@withRouter
export default class MorningBroadcast extends PureComponent {
  static propTypes = {
    dataList: PropTypes.array.isRequired,
    sourceList: PropTypes.object.isRequired,
    queryAudioFile: PropTypes.func.isRequired,
    isNewHome: PropTypes.bool,
  };

  static defaultProps = {
    isNewHome: false,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeMusic: '',
    };
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '收听' } })
  onListen(newsId, audioFileId) {
    const { queryAudioFile, sourceList = [] } = this.props;
    const sourceFile = sourceList[newsId];
    if (!sourceFile) {
      queryAudioFile({ newsId, audioFileId });
    }
    this.setState({
      activeMusic: newsId,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '停止播放' } })
  onHandleClose() {
    this.setState({
      activeMusic: '',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '更多' } })
  openNewTab(url) {
    const { push } = this.context;
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
    return `${request.prefix}/file/ceFileDownload2?attachId=${source.attachId}&empId=${emp.getId()}&filename=${window.encodeURIComponent(source.name)}`;
  }

  // 跳转至晨报详情
  @autobind
  @logable({ type: 'Click', payload: { name: '跳转至晨报详情' } })
  handleToDetail(newsId) {
    const { push } = this.context;
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
    const { dataList, sourceList = [], isNewHome } = this.props;
    const { activeMusic } = this.state;
    const trueStyles = isNewHome ? classes : styles;
    return (
      <div className={trueStyles.morning_broadcast}>
        <div className={trueStyles.title}>
          <span>{isNewHome ? '每日晨报' : '晨间播报'}</span>
          <span className={trueStyles.more} onClick={() => this.openNewTab('/strategyCenter/broadcastList')} >
            <span>更多</span>
            {
              isNewHome ? null : <img src={more} alt="" />
            }
          </span>
        </div>
        <div className={trueStyles.listWrap}>
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
                    <div key={newsId} className={trueStyles.item}>
                      <div
                        className={trueStyles.simpleName}
                      >
                        <Marquee content={`${newsTypValue}：${title}`} speed={40} />
                      </div>
                      <div className={trueStyles.music}>
                        <Audio src={audioSrc} autoPlay />
                        <Icon onClick={this.onHandleClose} className={trueStyles.close} type="close-circle" />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={newsId}
                    className={trueStyles.item}
                  >
                    <span
                      className={trueStyles.desc}
                      onClick={() => { this.handleToDetail(newsId); }}
                      title={title}
                    >
                      {`${newsTypValue}：${title}`}
                    </span>
                    {
                      isNewHome ?
                        <span
                          onClick={() => { this.onListen(newsId, audioFileId); }}
                          className={trueStyles.listen}
                        /> :
                        <span
                          onClick={() => { this.onListen(newsId, audioFileId); }}
                          className={trueStyles.listen}
                        >收听</span>
                    }
                  </div>
                );
              })
          }
        </div>
      </div>
    );
  }
}
