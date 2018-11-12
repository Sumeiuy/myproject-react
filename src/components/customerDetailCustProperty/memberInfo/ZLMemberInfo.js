/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-涨乐财富通会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 18:56:42
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import { Button } from 'antd';
import Table from '../../../components/common/table';
import Modal from '../../../components/common/biz/CommonModal';
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE, MemberGradeColumns } from '../config';
import styles from './zlMemberInfo.less';
const INFO_ITEM_WITDH = '110px';
export default class ZLMemberInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 涨乐财富通会员信息
    data: PropTypes.object.isRequired,
    // 涨乐U会员等级变更记录
    dataSource: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
      // 会员等级变更弹框
      memberGradeModalVisible: false,
      // 当前页码
      pageNum: 1,
    };
  }

  // 打开会员变更弹出框
  @autobind
  handleMemberGradeModalOpen(){
    this.setState({memberGradeModalVisible: true});
  }

  // 关闭会员变更弹出框
  @autobind
  handleMemberGradeModalClose(){
    this.setState({memberGradeModalVisible: false});
  }

  // 页码改变的回调
  @autobind
  handlePaginationChange(page){
    const { queryZLUmemberLevelChangeRecords, location: { query} } = this.props;
    this.setState({
      pageNum: page,
    });
    queryZLUmemberLevelChangeRecords({
      pageSize: 10,
      pageNum: page,
      custId: query && query.custId,
    });
  }

  @autobind
  getViewValue(value) {
    return _.isEmpty(value) ? DEFAULT_VALUE : value;
  }

  render() {
    const { memberGradeModalVisible, pageNum } = this.state;
    const { data, dataSource} = this.props;
    const { list = [], page = {} } = dataSource;
    const PaginationOption = {
      current: pageNum || 1,
      total: page.totalCount || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
     //  涨乐U会员等级变更记录的数据长度
     const memberGradeDatasLength = _.size(list);
     // 数据超过10条展示分页，反之不展示
     const showMemberGradePagination = memberGradeDatasLength > 10 ? PaginationOption : false;
    return (
      <div className={styles.zlMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock}></span>
          <span className={styles.titleText}>涨乐财富通会员</span>
          <span className={styles.iconButton}>
            <Icon type='huiyuandengjibiangeng' />
            <span onClick={this.handleMemberGradeModalOpen}>会员等级变更</span>
            <Modal
             title="会员等级变更"
             size='large'
             showOkBtn={false}
             visible={memberGradeModalVisible}
             closeModal={this.handleMemberGradeModalClose}
             onCancel={this.handleMemberGradeModalClose}
             selfBtnGroup={[(<Button onClick={this.handleMemberGradeModalClose}>关闭</Button>)]}
             modalKey="memberGrade"
             maskClosable={false}
            >
             <div className={styles.tabContainer}>
             <Table
              pagination={showMemberGradePagination}
              dataSource={list}
              columns={MemberGradeColumns}
              scroll={{ x: '1024px' }}
            />
          </div>
          </Modal>
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="用户号"
              value={this.getViewValue(data.custId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册手机号"
              value={this.getViewValue(data.phone)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="当前会员等级"
              value={this.getViewValue(data.currentLevel)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="历史最高等级"
              value={this.getViewValue(data.highestLevel)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="付费会员"
              value={this.getViewValue(data.isProAccount)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="首次付费日期"
              value={this.getViewValue(data.firstPayDate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="等级有效期"
              value={this.getViewValue(data.expiryDate)}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
