/**
 * @Author: sunweibin
 * @Date: 2018-06-12 15:12:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 20:35:11
 * @description 融资类业务驳回后修改页面
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import { Input } from 'antd';

import InfoTitle from '../../components/common/InfoTitle';
import InfoItem from '../../components/common/infoItem';
import FinanceCustRelationshipForm from '../../components/custRelationships/FinanceCustRelationshipForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom, dva } from '../../helper';

import styles from './rejectUpdateHome.less';

const TextArea = Input.TextArea;

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
    console.warn('111111111111111111111');
    // 初始化的时候，根据 flowId查询详情数据
    const { location: { query: { flowId = '' } } } = this.props;
    console.warn('222222222222222');
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

  @autobind
  handleRejectUpdateChange(obj) {
    this.setState(obj);
  }


  render() {
    const { detailForUpdate, relationshipTree } = this.props;
    if (_.isEmpty(detailForUpdate)) return null;
    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <div className={styles.rejectHeader}>
          <div className={styles.rejectAppId}>{`编号${detailForUpdate.id}`}</div>
        </div>
        <FinanceCustRelationshipForm
          action="UPDATE"
          custDetail={detailForUpdate}
          relationshipTree={relationshipTree}
          // 当用户选的数据发生变化时候的回调
          onChange={this.handleRejectUpdateChange}
        />
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={detailForUpdate.empName} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="申请时间" value={detailForUpdate.createTime} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={detailForUpdate.statusDesc} width="70px" />
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批" />
          <div className={styles.modContent}>
            <div className={styles.approvalIdeaArea}>
              <div className={styles.leftLabel}>审批意见：</div>
              <div className={styles.rightInput}>
                <TextArea />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
