/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-涨乐财富通会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-13 16:35:20
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
import moment from 'moment';
import logable, { logPV } from '../../../decorators/logable';

const INFO_ITEM_WITDH110 = '110px';
const INFO_ITEM_WITDH = '126px';
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
  @logPV ({
    pathname: '/modal/memberGradeModal',
    title: '涨乐会员变更弹框',
  })
  handleMemberGradeModalOpen(){
    this.setState({memberGradeModalVisible: true});
  }

  // 关闭会员变更弹出框
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '涨乐会员等级变更' }
 })
  handleMemberGradeModalClose(){
    this.setState({memberGradeModalVisible: false});
  }

  // 页码改变的回调
  @autobind
  @logable({ type: 'Click', payload: { name: '页码切换' } })
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
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    // 数据长达大于10显示分页
    const showMemberGradePagination =  page.totalPageNum !== 1 ? PaginationOption : false;
    //  处理日期
     const newmemberGradeDatas = _.map(list,  (items) => {
      const { time } = items;
      const newTime = moment(time).format('YYYY-MM-DD hh:mm:ss');
      return {
        ...items,
        time: newTime,
      };
    });
    return (
      <div className={styles.zlMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock}></span>
          <span className={styles.titleText}>涨乐U会员</span>
          <span className={styles.iconButton}>
            <Icon type='huiyuandengjibiangeng' />
            <span onClick={this.handleMemberGradeModalOpen}>会员等级变更</span>
            <Modal
                className={styles.memberGradeModal}
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
            {
              _.isEmpty(list)
              ? <div className={styles.noDataContainer}>
                  <Icon type="wushujuzhanweitu-" className={styles.noDataIcon}/>
                  <div className={styles.noDataText}>没有符合条件的记录</div>
              </div>
              : <div className={styles.tabContainer}>
             <Table
                pagination={showMemberGradePagination}
                dataSource={newmemberGradeDatas}
                columns={MemberGradeColumns}
                scroll={{ x: '1024px' }}
            />
          </div>
        }
          </Modal>
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
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
              width={INFO_ITEM_WITDH110}
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
