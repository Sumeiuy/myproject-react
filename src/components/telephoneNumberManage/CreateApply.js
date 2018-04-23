/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-23 09:38:41
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';
import confirm from '../common/Confirm';
import CommonModal from '../common/biz/CommonModal';
import InfoTitle from '../common/InfoTitle';
import SimilarAutoComplete from '../common/similarAutoComplete';
import styles from './createApply.less';


export default class CreateFilialeCustTransfer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    closeCreateModalBoard: PropTypes.func.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object,
    queryAdvisorList: PropTypes.func.isRequired,
    // 新建页面获取下一步审批人
    nextApprovalData: PropTypes.array,
    queryNextApproval: PropTypes.func.isRequired,
  }

  static defaultProps = {
    advisorListData: {},
    nextApprovalData: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 选择的服务经理
      customerList: [],
    };
  }

  componentWillMount() {
    // 获取下一步审批人
    this.props.queryNextApproval({});
  }

  @autobind
  closeModal() {
    this.props.closeCreateModalBoard();
  }

  @autobind
  handleValidate(customer) {
    const { customerList } = this.state;
    // 判断是否已经存在改用户
    const exist = _.findIndex(customerList, o => o.cusId === customer.cusId) > -1;
    // 如果存在，则不给添加
    if (exist) {
      confirm({ shortCut: 'custExist' });
      return;
    }
    // 如果客户列表中已经有200个客户，则不让再添加
    if (customerList.length >= 200) {
      confirm({ shortCut: 'custListMaxLength' });
      return;
    }
    this.setState({ customer });
    // this.props.onValidate(customer);
  }

  // 搜索客户列表
  @autobind
  handleSearchCustList(keyword) {
    this.props.queryAdvisorList({
      keyword,
    });
  }

  render() {
    const {
      isShowModal,
    } = this.state;
    const { advisorListData } = this.props;
    const { advisorList } = advisorListData;
    return (
      <CommonModal
        title="新建公务手机申请"
        visible={isShowModal}
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
      >
        <div className={styles.createApplyWrapper} >
          <div id="createApplyEmp_module" className={styles.module}>
            <InfoTitle head="服务经理" />
            <div className={styles.selectSearchBox}>
              <SimilarAutoComplete
                name="CreateApplySelect"
                placeholder="经纪客户号/客户名称"
                searchList={advisorList}
                width={184}
                showObjKey="key"
                objId="key"
                onSelect={this.handleSelectCust}
                onSearch={this.handleSearchCustList}
                renderOption={this.renderOption}
              />
              <Button className={styles.addButton} onClick={this.handleAddBtnClick}>添加</Button>
            </div>
          </div>
        </div>
      </CommonModal>
    );
  }
}
