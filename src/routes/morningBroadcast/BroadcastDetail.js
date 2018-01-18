/**
 * Created By K0170179 on 2018/1/12
 * 播报详情
 * @author xzqiang(crazy_zhiqiang@sina.com)
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './boradcastDetail.less';

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
};

@connect(mapStateToProps, mapDispatchToProps)
export default class BroadcastDetail extends PureComponent {
  static propTypes = {
    boradcastDetail: PropTypes.object.isRequired,
    getBoradcastDetail: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getBoradcastDetail } = this.props;
    getBoradcastDetail();
  }

  render() {
    const { boradcastDetail } = this.props;
    return (
      <div className={styles.broadcastDetail_wrap}>
        <div className={styles.broadcastDetail}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.title}>{ boradcastDetail.title }</div>
              <div className={styles.info}>
                <div>类型：{ boradcastDetail.type }</div>
                <div>作者：{ boradcastDetail.author }</div>
                <div>发布日期：{ boradcastDetail.date }</div>
              </div>
              <div className={`${styles.backList} ${styles.headerBack}`}>
                <i className="icon iconfont icon-fanhui" />
                晨间播报列表
              </div>
            </div>
            <div className={styles.body}>
              <p>{ boradcastDetail.abstract }</p>
              <p>{ boradcastDetail.content }</p>
            </div>
            <div className={styles.footer}>
              <div className={styles.downMusic}>
                <i className="icon iconfont icon-shipinwenjian" style={{ color: '#2d86d8' }} />
                <span>音频文件</span>
                <audio src={`${boradcastDetail.source}`} controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className={styles.downOther}>
                <i className="icon iconfont icon-qitawenjian" style={{ color: '#cdcdcd' }} />
                <span>其他文件</span>
                <i className="icon iconfont icon-xiazai" />
              </div>
              <div className={`${styles.backList} ${styles.footerBack}`}>
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
