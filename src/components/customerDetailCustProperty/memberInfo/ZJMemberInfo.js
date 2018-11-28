/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-紫金积分会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-23 14:47:08
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
import {
  checkIsNeedTitle,
} from '../config';
import logable, { logPV } from '../../../decorators/logable';
import ZJMemeberInfoModal from './ZJMemberInfoModal';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
const PAGE_SIZE = 10;
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
    };
  }

  // 打开积分兑换流水弹框
  @autobind
  @logPV ({
    pathname: '/modal/integralFlowModal',
    title: '积分兑换流水弹框',
  })
  handleIntegralFlowModalOpen() {
    const {
      queryZjPointExchangeFlow,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    queryZjPointExchangeFlow({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    }).then(() => {
      this.setState({ integralFlowModalVisible: true });
    });
  }

  // 关闭积分兑换流水弹框
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '紫金会员兑换流水' },
 })
  handleIntegralFlowModalClose() {
    this.setState({ integralFlowModalVisible: false });
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
    const { integralFlowModalVisible } = this.state;
    const {
      location,
      data,
      dataSource,
      queryZjPointExchangeFlow,
    } = this.props;
    return (
      <div className={styles.zjMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock} />
          <span className={styles.titleText}>紫金积分会员</span>
          <span className={styles.iconButton}>
            <Icon type='jifenduihuanliushui1' />
            <span onClick={this.handleIntegralFlowModalOpen}>积分兑换流水</span>
            <ZJMemeberInfoModal
              location={location}
              visible={integralFlowModalVisible}
              dataSource={dataSource}
              queryZjPointExchangeFlow={queryZjPointExchangeFlow}
              onClose={this.handleIntegralFlowModalClose}
            />
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="会员编号"
              value={this.getViewValue(data.memberNum)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.memberNum))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员名称"
              value={this.getViewValue(data.memberName)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.memberName))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员类型"
              value={this.getViewValue(data.memberType)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.memberType))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="项目"
              value={this.getViewValue(data.projects)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.projects))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="注册日期"
              value={this.getViewValue(data.registerDate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.registerDate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="状态"
              value={this.getViewValue(data.states)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.states))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币可用积分"
              value={this.getViewTextByNum(data.zjAvailablePoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.zjAvailablePoints))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币累计积分"
              value={this.getViewTextByNum(data.zjSumPoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.zjSumPoints))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="涨乐豆可用积分"
              value={this.getViewTextByNum(data.zlAvailablePoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.zlAvailablePoints))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="涨乐豆累计积分"
              value={this.getViewTextByNum(data.zlSumPoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.zlSumPoints))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资金积分"
              value={this.getViewTextByNum(data.fundPoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.fundPoints))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="贡献度积分"
              value={this.getViewTextByNum(data.devotePoints)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.devotePoints))}
              isNeedOverFlowEllipsis
            />
          </div>
        </div>
      </div>
    );
  }
}
