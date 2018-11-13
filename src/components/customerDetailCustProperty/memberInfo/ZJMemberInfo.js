/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-紫金积分会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-13 16:27:10
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE } from '../config';
import { number } from '../../../helper';
import styles from './zjMemberInfo.less';
import Modal from '../../../components/common/biz/CommonModal';
import { Button } from 'antd';
import Table from '../../../components/common/table';
import { integralFlowColumns } from '../config';
import moment from 'moment';
import logable, { logPV } from '../../../decorators/logable';

const INFO_ITEM_WITDH110 = '110px';
const INFO_ITEM_WITDH = '126px';
export default class ZJMemberInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 会员信息
    data: PropTypes.object.isRequired,
    // 紫金积分会员积分兑换流水
    dataSource: PropTypes.object.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
     // 积分兑换流水弹框
     integralFlowModalVisible: false,
    //  当前页码
    pageNum: 1,
    };
  }

  // 打开积分兑换流水弹框
  @autobind
  @logPV ({
    pathname: '/modal/integralFlowModal',
    title: '积分兑换流水弹框',
  })
  handleIntegralFlowModalOpen(){
    this.setState({integralFlowModalVisible: true});
  }

  // 关闭积分兑换流水弹框
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '紫金会员兑换流水' }
 })
  handleIntegralFlowModalClose(){
    this.setState({integralFlowModalVisible: false});
  }

  // 页码切换的回调
  @autobind
  @logable({ type: 'Click', payload: { name: '页码切换' } })
  handlePaginationChange(page){
    const { queryZjPointExchangeFlow, location: { query} } = this.props;
    this.setState({
      pageNum: page,
    });
    queryZjPointExchangeFlow({
      pageSize: 10,
      pageNum: page,
      custId: query && query.custId,
    });
  }

  @autobind
  renderColumns(){
    return _.map(integralFlowColumns,  (items) => {
      const { dataIndex } = items;
      let newItems = { ...items };
      // 处理日期格式和加上title
      if(dataIndex === 'tradeDate' || dataIndex === 'processDate'){
        newItems =  {
          ...items,
          render: text => {
            const date = text && moment(text).format('YYYY-MM-DD');
            return <span title={text}>{date || '--'}</span>;
          },
        };
      }
      return newItems;
    });
  }

  @autobind
  getViewValue(value) {
    return _.isEmpty(value) ? DEFAULT_VALUE : value;
  }

  // 获取数值显示数据
  @autobind
  getViewTextByNum(value) {
    return _.isNumber(value) ? number.thousandFormat(value) : DEFAULT_VALUE;
  }

  render() {
    const { integralFlowModalVisible, pageNum } = this.state;
    const { data, dataSource } = this.props;
    const { tradeFlow = [], page = {} } = dataSource;
    const PaginationOption = {
      current: pageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
    // 数据长达大于10显示分页
    const showIntegralFlowPagination =  page.totalPageNum !== 1 ? PaginationOption : false;
     //处理数据
     const newIntegralFlowDatas = _.map(tradeFlow,  (items) => {
      const { productQuantity } = items;
      const newProductQuantity = number.thousandFormat(number.toFixed(productQuantity));
      return {
        ...items,
        productQuantity: newProductQuantity,
      };
    });

    return (
      <div className={styles.zjMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock}></span>
          <span className={styles.titleText}>紫金积分会员</span>
          <span className={styles.iconButton}>
            <Icon type='jifenduihuanliushui' />
            <span onClick={this.handleIntegralFlowModalOpen}>积分兑换流水</span>
            <Modal
              className={styles.integralFlowModal}
              title="积分兑换流水"
              size='large'
              showOkBtn={false}
              visible={integralFlowModalVisible}
              closeModal={this.handleIntegralFlowModalClose}
              onCancel={this.handleIntegralFlowModalClose}
              selfBtnGroup={[(<Button onClick={this.handleIntegralFlowModalClose}>关闭</Button>)]}
              modalKey="integralFlow"
              maskClosable={false}
            >
            {
              _.isEmpty(tradeFlow)
              ? <div className={styles.noDataContainer}>
                <Icon type="wushujuzhanweitu-" className={styles.noDataIcon}/>
                <div className={styles.noDataText}>没有符合条件的记录</div>
              </div>
               : <div className={styles.tabContainer}>
                <Table
                  pagination={showIntegralFlowPagination}
                  dataSource={newIntegralFlowDatas}
                  isNeedEmptyRow
                  columns={this.renderColumns()}
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
              label="会员编号"
              value={this.getViewValue(data.memberNum)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员名称"
              value={this.getViewValue(data.memberName)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员类型"
              value={this.getViewValue(data.memberType)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="项目"
              value={this.getViewValue(data.projects)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="注册日期"
              value={this.getViewValue(data.registerDate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="状态"
              value={this.getViewValue(data.states)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币可用积分"
              value={this.getViewTextByNum(data.zjAvailablePoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币累计积分"
              value={this.getViewTextByNum(data.zjSumPoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="涨乐豆可用积分"
              value={this.getViewTextByNum(data.zlAvailablePoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="涨乐豆累计积分"
              value={this.getViewTextByNum(data.zlSumPoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资金积分"
              value={this.getViewTextByNum(data.fundPoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="贡献度积分"
              value={this.getViewTextByNum(data.devotePoints)}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
