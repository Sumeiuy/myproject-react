/**
 * Created By K0170179 on 2018/1/12
 * 播报详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import styles from './boradcastDetail.less';
import { url as urlHelper } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { openRctTab } from '../../utils';


const effects = {
  getBoradcastDetail: 'morningBoradcast/getBoradcastDetail',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  boradcastDetail: state.morningBoradcast.boradcastDetail,
});

const mapDispatchToProps = {
  getBoradcastDetail: fetchDataFunction(true, effects.getBoradcastDetail),
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BroadcastDetail extends PureComponent {
  static propTypes = {
    boradcastDetail: PropTypes.object.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { newItemDetail, newsId } = this.getItemDetail();
    const { getBoradcastDetail } = this.props;
    if (_.isEmpty(newItemDetail) && newsId) {
      getBoradcastDetail({ newId: newsId });
    }
  }

  @autobind()
  getItemDetail() {
    const { location: { query } } = this.props;
    const { newsId } = query;
    const { boradcastDetail } = this.props;
    const newItemDetail = boradcastDetail[newsId] || {};
    return { newItemDetail, newsId };
  }

  @autobind
  handleBackClick() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const { push } = this.props;
    const param = { id: 'RTC_TAB_NEWS_LIST', title: '晨报' };
    const url = '/broadcastList';
    const query = { };
    openRctTab({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(query)}`,
      param,
      pathname: url,
      query,
    });
  }

  render() {
    const { newItemDetail } = this.getItemDetail();

    return (
      <div className={styles.broadcastDetail_wrap}>
        <div className={styles.broadcastDetail}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.title}>{ newItemDetail.title }</div>
              <div className={styles.info}>
                <div>类型：{ newItemDetail.type }</div>
                <div>作者：{ newItemDetail.author }</div>
                <div>发布日期：{ newItemDetail.date }</div>
              </div>
              <div onClick={this.handleBackClick} className={`${styles.backList} ${styles.headerBack}`}>
                <i className="icon iconfont icon-fanhui" />
                晨间播报列表
              </div>
            </div>
            <div className={styles.body}>
              <p>{ newItemDetail.summary }</p>
              <p>{ newItemDetail.content }</p>
            </div>
            <div className={styles.footer}>
              <div className={styles.downMusic}>
                <i className="icon iconfont icon-shipinwenjian" style={{ color: '#2d86d8' }} />
                <span>音频文件</span>
                <audio src={`${newItemDetail.source}`} controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className={styles.downOther}>
                <i className="icon iconfont icon-qitawenjian" style={{ color: '#cdcdcd' }} />
                <span>其他文件</span>
                <i className="icon iconfont icon-xiazai" />
              </div>
              <div onClick={this.handleBackClick} className={`${styles.backList} ${styles.footerBack}`}>
                <i className="icon iconfont icon-fanhui" />
                晨间播报列表
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
