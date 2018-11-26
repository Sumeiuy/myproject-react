/*
 * @Author: wangyikai
 * @Date: 2018-11-19 15:58:39
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-23 11:14:13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { dva } from '../../../../helper';
import BusinessHand from '../../../../components/customerDetailBusinessHand/BusinessHand';
const effect = dva.generateEffect;
const mapStateToProps = state => ({
  // 业务办理下已开通业务数据
  openBusinessData: state.detailBusinessHand.openBusinessData,
  // 业务办理下未开通业务数据
  notOpenBusinessData: state.detailBusinessHand.notOpenBusinessData,
  // 业务办理下未开通业务中的操作弹框数据
  operationData: state.detailBusinessHand.operationData,
});
const mapDispatchToProps = {
  // 查询业务办理下已开通业务信息
  getOpenBusiness: effect('detailBusinessHand/getOpenBusiness'),
  // 查询业务办理下未开通业务信息
 getNotOpenBusiness: effect('detailBusinessHand/getNotOpenBusiness'),
  // 查询业务办理下未开通业务中的操作弹框信息
 getDetailOperation: effect('detailBusinessHand/getDetailOperation'),
  // 清除Redux中的数据
  clearReduxData: effect('detailBusinessHand/clearReduxData', { loading: false }),
};
@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 业务办理下已开通业务数据
    openBusinessData: PropTypes.array.isRequired,
    // 业务办理下未开通业务数据
    notOpenBusinessData: PropTypes.array.isRequired,
    // 业务办理下未开通业务中的操作弹框数据
    operationData: PropTypes.array.isRequired,
    // 查询业务办理下已开通业务信息
    getOpenBusiness: PropTypes.func.isRequired,
    // 查询业务办理下未开通业务信息
    getNotOpenBusiness: PropTypes.func.isRequired,
    // 查询业务办理下未开通业务中的操作弹框信息
    getDetailOperation: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    this.queryBusinessHandlData(custId);
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      this.queryBusinessHandlData(custId);
    }
  }

  queryBusinessHandlData(custId) {
    const {
      getOpenBusiness,
      getNotOpenBusiness,
    } = this.props;
    getOpenBusiness({ custId });
    getNotOpenBusiness({ custId });
  }

  render() {
    const {
      location,
      openBusinessData,
      notOpenBusinessData,
      operationData,
      getOpenBusiness,
      getNotOpenBusiness,
      getDetailOperation,
    } = this.props;
    return (
      <div>
        <BusinessHand
          location={location}
          openBusinessData={openBusinessData}
          notOpenBusinessData={notOpenBusinessData}
          operationData={operationData}
          getOpenBusiness={getOpenBusiness}
          getNotOpenBusiness={getNotOpenBusiness}
          getDetailOperation={getDetailOperation}
          />
      </div>
    );
  }
}
