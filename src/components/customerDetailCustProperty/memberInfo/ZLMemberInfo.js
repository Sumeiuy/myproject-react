/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-涨乐财富通会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-23 14:47:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import InfoItem from '../../common/infoItem';
import {
  DEFAULT_VALUE,
  checkIsNeedTitle,
} from '../config';
import styles from './zlMemberInfo.less';
import logable, { logPV } from '../../../decorators/logable';
import ZLMemeberInfoModal from './ZLMemeberInfoModal';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
const PAGE_SIZE = 10;
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
  constructor(props) {
    super(props);
    this.state = {
      // 会员等级变更弹框
      memberGradeModalVisible: false,
    };
  }

  // 打开会员变更弹出框
  @autobind
  @logPV ({
    pathname: '/modal/memberGradeModal',
    title: '涨乐会员变更弹框',
  })
  handleMemberGradeModalOpen() {
    const {
      queryZLUmemberLevelChangeRecords,
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    queryZLUmemberLevelChangeRecords({
      custId,
      pageSize: PAGE_SIZE,
      pageNum: 1,
    }).then(() => {
      this.setState({ memberGradeModalVisible: true });
    });
  }

  // 关闭会员变更弹出框
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '涨乐会员等级变更' }
 })
  handleMemberGradeModalClose() {
    this.setState({ memberGradeModalVisible: false });
  }

  @autobind
  getViewValue(value) {
    return _.isEmpty(value) ? DEFAULT_VALUE : value;
  }

  render() {
    const { memberGradeModalVisible } = this.state;
    const {
      data,
      location,
      dataSource,
      queryZLUmemberLevelChangeRecords,
     } = this.props;
    return (
      <div className={styles.zlMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock} />
          <span className={styles.titleText}>涨乐U会员</span>
          <span className={styles.iconButton}>
            <Icon type='huiyuandengjibiangeng' />
            <span onClick={this.handleMemberGradeModalOpen}>会员等级变更</span>
            <ZLMemeberInfoModal
              location={location}
              visible={memberGradeModalVisible}
              dataSource={dataSource}
              queryZLUmemberLevelChangeRecords={queryZLUmemberLevelChangeRecords}
              onClose={this.handleMemberGradeModalClose}
            />
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="用户号"
              value={this.getViewValue(data.custId)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.custId))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册手机号"
              value={this.getViewValue(data.phone)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.phone))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="当前会员等级"
              value={this.getViewValue(data.currentLevel)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.currentLevel))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="历史最高等级"
              value={this.getViewValue(data.highestLevel)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.highestLevel))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="付费会员"
              value={this.getViewValue(data.isProAccount)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.isProAccount))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="首次付费日期"
              value={this.getViewValue(data.firstPayDate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.firstPayDate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="等级有效期"
              value={this.getViewValue(data.expiryDate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewValue(data.expiryDate))}
              isNeedOverFlowEllipsis
            />
          </div>
        </div>
      </div>
    );
  }
}
