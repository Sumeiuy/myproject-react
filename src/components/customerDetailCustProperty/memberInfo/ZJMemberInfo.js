/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-紫金积分会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 18:17:45
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import InfoItem from '../../common/infoItem';
import styles from './zjMemberInfo.less';
import Modal from '../../../components/common/biz/CommonModal';
import { Button } from 'antd';
import Table from '../../../components/common/table';
import { integralFlowColumns } from '../config';
import _ from 'lodash';
import { number} from '../../../helper';
import moment from 'moment';

const INFO_ITEM_WITDH = '110px';
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
  handleIntegralFlowModalOpen(){
    this.setState({integralFlowModalVisible: true});
  }

  // 关闭积分兑换流水弹框
  @autobind
  handleIntegralFlowModalClose(){
    this.setState({integralFlowModalVisible: false});
  }

  // 页码切换的回调
  @autobind
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

  render() {
    const { integralFlowModalVisible, pageNum } = this.state;
    const { data, dataSource} = this.props;
    const { tradeFlow = [], page = {} } = dataSource;
    const PaginationOption = {
      current: pageNum || 1,
      total: page.totalCount || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePaginationChange,
    };
      // 紫金积分会员积分兑换流水的数据长度
     const IntegralFlowDatasLength = _.size(tradeFlow);
    //  数据超过10条展示分页，反之不展示
     const showIntegralFlowPagination = IntegralFlowDatasLength > 10 ? PaginationOption : false;
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
                <div className={styles.noDataText}>没有符合条件的客户</div>
              </div>
              : <div className={styles.tabContainer}>
                <Table
                  pagination={showIntegralFlowPagination}
                  dataSource={newIntegralFlowDatas}
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
              width={INFO_ITEM_WITDH}
              label="会员编号"
              value={data.memberNum}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员名称"
              value={data.memberName}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员类型"
              value={data.memberType}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="项目"
              value={data.projects}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册日期"
              value={data.registerDate}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="状态"
              value={data.states}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币可用积分"
              value={data.zjAvailablePoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="涨乐豆可用积分"
              value={data.zlAvailablePoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资金积分"
              value={data.fundPoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="贡献度积分"
              value={data.devotePoints}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
