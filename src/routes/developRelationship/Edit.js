/**
 * @Author: hongguangqing
 * @Date: 2018-01-15 14:02:17
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-16 09:55:53
 */

import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import EditForm from '../../components/developRelationship/EditForm';
import Barable from '../../decorators/selfBar';
import { seibelConfig } from '../../config';

const { developRelationship: { pageType } } = seibelConfig;
// TODO: TESTFLOWID常量，仅用于自测（flowId 从location中获取，跳转的入口在FSP内）
const TESTFLOWID = '6576AF013232CA46A76A10FA0859B0F2';
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情数据
  detailInfo: state.developRelationship.detailInfo,
  // 可添加新开发团队的服务经理列表
  addEmpList: state.developRelationship.addEmpList,
  // 获取按钮列表和下一步审批人
  buttonList: state.developRelationship.buttonList,
});

const mapDispatchToProps = {
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'developRelationship/getDetailInfo', true),
  // 获取可添加新开发团队服务经理的接口
  getAddEmpList: fetchDataFunction(false, 'developRelationship/getAddEmpList'),
  // 获取按钮列表和下一步审批人
  getButtonList: fetchDataFunction(false, 'developRelationship/getButtonList'),
  // 获取修改私密客户申请 的结果
  updateApplication: fetchDataFunction(false, 'developRelationship/updateApplication'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class DevelopRelationshipEdit extends PureComponent {
  static propTypes = {
    // location
    location: PropTypes.object.isRequired,
    // 详情列表
    detailInfo: PropTypes.object.isRequired,
    // 获取详情列表的方法
    getDetailInfo: PropTypes.func.isRequired,
    // 服务经理列表
    addEmpList: PropTypes.array.isRequired,
    // 获取服务经理列表方法
    getAddEmpList: PropTypes.func.isRequired,
    // 审批按钮列表
    buttonList: PropTypes.object.isRequired,
    // 请求审批按钮方法
    getButtonList: PropTypes.func.isRequired,
    // 修改页面的方法
    updateApplication: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  static childContextTypes = {
    getSearchServerPersonList: PropTypes.func.isRequired,
  }


  componentDidMount() {
    const { getDetailInfo, location: { query: { flowId } } } = this.props;
    const newFolwId = (flowId && !_.isEmpty(flowId)) ? flowId : TESTFLOWID;
    // 获取详情
    getDetailInfo({
      flowId: newFolwId,
      type: pageType,
    });
  }

  @autobind
  updateValue(name, value) {
    // 更新state
    if (name === 'customer') {
      this.setState({ customer: {
        custName: value.custName,
        custNumber: value.cusId,
      } });
    }
    this.setState({ [name]: value });
  }

  // 修改开发关系认定申请
  @autobind
  handleModifyPrivateApp(params) {
    const { location: { query } } = this.props;
    this.props.updateApplication(params).then(
      () => this.queryAppList(query, query.pageNum, query.pageSize),
    );
  }

  render() {
    const {
      detailInfo,
      addEmpList,
      getAddEmpList,
      getButtonList,
      buttonList,
    } = this.props;
    if (_.isEmpty(detailInfo)) {
      return null;
    }
    return (
      <div>
        <EditForm
          data={detailInfo}
          addEmpList={addEmpList}
          getAddEmpList={getAddEmpList}
          getButtonList={getButtonList}
          buttonList={buttonList}
          handleModifyPrivateApp={this.handleModifyPrivateApp}
        />
      </div>
    );
  }
}
