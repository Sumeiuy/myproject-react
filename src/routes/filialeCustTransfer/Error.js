/*
 * @Description: 批量划转的错误提醒页面
 * @Author: LiuJianShu
 * @Date: 2018-02-02 15:37:14
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2018-02-02 16:11:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import Icon from '../../components/common/Icon';
import styles from './error.less';

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 批量划转的数据
  errorMsg: state.filialeCustTransfer.errorMsg,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 清空批量划转的数据
  getErrorMsg: fetchDataFunction(true, 'filialeCustTransfer/getErrorMsg', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class FilialeCustTransferError extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 清空批量划转的数据
    getErrorMsg: PropTypes.func,
    errorMsg: PropTypes.object,
  }

  static defaultProps = {
    errorMsg: {},
    getErrorMsg: _.noop,
  }

  componentWillMount() {
    const {
      location: {
        query: {
          notifiId,
        },
      },
      getErrorMsg,
    } = this.props;
    getErrorMsg({ notifiId });
  }

  render() {
    const {
      // 清空批量划转的数据
      errorMsg,
      errorMsg: { time, success, fail },
    } = this.props;
    if (_.isEmpty(errorMsg)) {
      return null;
    }
    return (
      <div className={styles.errorMsgWrapper}>
        <p>
          您于 {time} 提交的批量导入客户服务关系调整数据处理失败，有 {success} 行客户校验通过，有 {fail} 行客户校验不通过！
        </p>
        <p><a><Icon type="xiazai1" />点击下载文件，在报错信息列查看报错信息</a></p>
      </div>
    );
  }
}
