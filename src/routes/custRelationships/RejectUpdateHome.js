/**
 * @Author: sunweibin
 * @Date: 2018-06-12 15:12:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 16:22:33
 * @description 融资类业务驳回后修改页面
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';

import FinanceCustRelationshipForm from '../../components/custRelationships/FinanceCustRelationshipForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom, dva } from '../../helper';

import styles from './rejectUpdateHome.less';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 驳回后修改页面的详情数据
  detailForUpdate: state.custRelationships.detailForUpdate,
  // 关联关系树
  relationshipTree: state.custRelationships.relationshipTree,
});

const mapDispatchToProps = {
  // 获取驳回后修改页面的详情数据 api
  getDetailForUpdate: effect('custRelationships/getDetailForUpdate'),
  // 根据客户类型获取关联关系树 api
  getRelationshipTree: effect('custRelationships/getRelationshipTree', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectUpdateHome extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 驳回后修改页面的详情数据
    detailForUpdate: PropTypes.object.isRequired,
    // 关联关系树
    relationshipTree: PropTypes.array.isRequired,
    // 根据客户类型获取关联关系树 api
    getRelationshipTree: PropTypes.func.isRequired,
    // 获取驳回后修改页面的详情数据 api
    getDetailForUpdate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
    // 此处为 React 16.3 API
    this.rejectHomeRef = React.createRef();
  }

  componentDidMount() {
    this.setHomeHeight();
    // 初始化的时候，根据 flowId查询详情数据
    const { location: { query: { flowId = '' } } } = this.props;
    // 获取到详情数据后，在根据详情数据获取关联关系树
    this.props.getDetailForUpdate({ flowId }).then(() => {
      const { detailForUpdate: { custDetail = {} }, getRelationshipTree } = this.props;
      getRelationshipTree({ custType: custDetail.custTypeValue });
    });
  }

  @autobind
  setHomeHeight() {
    let height = dom.getCssStyle(document.documentElement, 'height');
    if (env.isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    dom.setStyle(this.rejectHomeRef.current, 'height', height);
  }


  render() {
    const { detailForUpdate } = this.props;
    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <FinanceCustRelationshipForm
          action="UPDATE"
          custDetail={detailForUpdate}
        />
      </div>
    );
  }
}
