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
import { url as urlHelper, emp } from '../../helper';
import withRouter from '../../decorators/withRouter';
import { openRctTab } from '../../utils';
import { request } from '../../config';
import styles from './boradcastDetail.less';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Audio from '../../components/common/audio/Audio';


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
      getBoradcastDetail({ newsId });
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
    const { audioFileList = [], otherFileList = [] } = newItemDetail;
    const audioSource = audioFileList[0];
    const { attachId, name } = audioSource || [];
    return (
      <div className={styles.broadcastDetail_wrap}>
        <div className={styles.broadcastDetail}>
          <div className={styles.content}>
            <div onClick={this.handleBackClick} className={`${styles.backList} ${styles.headerBack}`}>
              <i className="icon iconfont icon-fanhui" />
              晨间播报列表
            </div>
            <div className={styles.header}>
              <div className={styles.title}>{ newItemDetail.title }</div>
              <div className={styles.info}>
                <div>类型：{ newItemDetail.newsTypValue }</div>
                <div>作者：{ newItemDetail.updatedBy || newItemDetail.createdBy }</div>
                <div>发布日期：{ newItemDetail.created }</div>
              </div>
            </div>
            <div className={styles.body}>
              <p>{ newItemDetail.summary }</p>
              <p>{ newItemDetail.content }</p>
            </div>
            <div className={styles.footer}>
              <div className={styles.downMusic}>
                <i className="icon iconfont icon-shipinwenjian" style={{ color: '#2d86d8' }} />
                <div className={styles.audioTitle} title="点击下载">
                  <a href={`${request.prefix}/file/ceFileDownload?attachId=${attachId}&empId=${emp.getId()}&filename=${name}`}>
                    音频文件
                  </a>
                </div>
                <div className={styles.audioControl}>
                  {
                    attachId &&
                    <Audio
                      isShowTip
                      src={`${request.prefix}/file/ceFileDownload?attachId=${attachId}&empId=${emp.getId()}&filename=${name}`}
                    />
                  }
                </div>
              </div>
              {
                otherFileList.length ? (
                  <span>
                    <div className={styles.downOther}>
                      <i className="icon iconfont icon-qitawenjian" style={{ color: '#cdcdcd' }} />
                      <span>其他文件</span>
                    </div>
                    <CommonUpload
                      attachmentList={otherFileList}
                      edit={false}
                    />
                  </span>
                ) : null
              }
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
