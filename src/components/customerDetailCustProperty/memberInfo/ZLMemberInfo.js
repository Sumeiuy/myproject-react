/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-涨乐财富通会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-09 19:08:30
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import { Button } from 'antd';
import Table from '../../../components/common/table';
import Modal from '../../../components/common/biz/CommonModal';
import InfoItem from '../../common/infoItem';
import styles from './zlMemberInfo.less';
import { MemberGradeColumns } from '../config';
const INFO_ITEM_WITDH = '110px';
export default class ZLMemberInfo extends PureComponent {
  static propTypes = {
    // 涨乐财富通会员信息
    data: PropTypes.object.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
     // 会员等级变更弹框
     memberGradeModalVisible: false,
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
  render() {
    const { memberGradeModalVisible } = this.state;
    const { data } = this.props;
    // const { list = [], page = {} } = listData;
    // const PaginationOption = {
    //   current: page.pageNum || 1,
    //   total: page.totalCount || 0,
    //   pageSize: page.pageSize || 10,
    //   onChange: this.handlePaginationChange,
    // };
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
             {/* <div className={styles.tabContainer}>
             <Table
              // pagination={showMemberGradePagination}
              className={styles.tabPaneWrap}
              // dataSource={obj}
              columns={MemberGradeColumns}
              scroll={{ x: '1030px' }}
            />
          </div> */}
          </Modal>
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="用户号"
              value={data.custId}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册手机号"
              value={data.phone}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="当前会员等级"
              value={data.currentLevel}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="历史最高等级"
              value={data.highestLevel}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="付费会员"
              value={data.isProAccount}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="首次付费日期"
              value={data.firstPayDate}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="等级有效期"
              value={data.expiryDate}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
