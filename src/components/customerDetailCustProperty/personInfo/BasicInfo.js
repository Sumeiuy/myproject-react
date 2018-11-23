/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-22 16:15:11
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import InfoItem from '../../common/infoItem';
import BasicEditorCell from '../common/BasiceEditorCell';
import {
  DEFAULT_VALUE,
  DEFAULT_PRIVATE_VALUE,
  getViewTextByBool,
  checkIsNeedTitle,
} from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';

export default class BasicInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
    // 修改个人客户、机构客户的基本信息
    updateCustBasicInfo: PropTypes.func.isRequired,
    // 用于刷新客户基本信息
    queryCustomerProperty: PropTypes.func.isRequired,
  }

  // 获取需要隐私控制的数据，有权限则展示字段，有权限没有数据则展示--，无权限则展示***
  @autobind
  getPrivateValue(value) {
    const { hasDuty } = this.props;
    return hasDuty ? (value || DEFAULT_VALUE) : DEFAULT_PRIVATE_VALUE;
  }

  // 获取子女数量显示数据，由于InfoItem value只接受string,所以转了一次字符串
  @autobind
  getChildNumText(value) {
    return _.isNumber(value) ? value.toString() : DEFAULT_VALUE;
  }

  // 修改个人客户基本信息
  @autobind
  updateBasicInfo(param) {
    const {
      location: { query: { custId }}
    } = this.props;
    return this.props.updateCustBasicInfo({
      custNature: 'per',
      custId,
      ...param,
    }).then((resultData) => {
      // 使用这种方式为了让原地编辑组件能够控制loading的状态
      if (!_.isEmpty(resultData)) {
        const flag = resultData.result === 'success';
        if (!flag) {
          // 如果成功
          message.error(resultData.message || '失败');
        }
        return flag;
      }
      return false;
    });
  }

  // 用于修改成功刷新基本信息数据
  @autobind
  refreshCustProperty() {
    const {
      location: { query: { custId }}
    } = this.props;
    this.props.queryCustomerProperty({
      custId,
    });
  }

  // 修改子女数量
  @autobind
  updateChildNum(value) {
    // 此处为修改个人客户信息的子女数量信息，所以
    return this.updateBasicInfo({
      infoKey: 'childNum',
      infoValue: Number(value),
    });
  }

  // 校验子女数量必须是数字
  @autobind
  checkChildNumValue(value) {
    if (_.isEmpty(value)) {
      return { validate: false, msg: '数据不能为空' };
    }
    if (_.isNumber(_.trim(value))) {
      return { validate: false, msg: '子女数量必须是数字' };
    }
    return { validate: true, msg: '' };
  }

  // 修改婚姻状态
  @autobind
  updateMarryState(value) {
    this.updateBasicInfo({
      infoKey: 'maritalCode',
      infoValue: value,
    });
  }

  // 修改爱好
  @autobind
  upadateHobby(value) {
    this.updateBasicInfo({
      infoKey: 'hobby',
      infoValue: value,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.basicInfoBox}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="出生日期"
              value={data.birthDate || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.birthDate || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="职业"
              value={data.profession || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.profession || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="学历"
              value={data.education || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.education || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国籍"
              value={data.nationality || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.nationality || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="证件类型"
              value={this.getPrivateValue(data.certType)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.certType))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证件号码"
              value={this.getPrivateValue(data.certId)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.certId))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证件有效期"
              value={this.getPrivateValue(data.certValdate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.certValdate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="是否企业高管"
              value={getViewTextByBool(data.isCompanyLeader)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(getViewTextByBool(data.isCompanyLeader))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <BasicEditorCell
              label="婚姻状况"
              width={INFO_ITEM_WITDH_110}
              className={styles.infoItem}
              editorId="person_children_num"
              onEditOK={_.noop}
              mode="select"
              value={data.maritalText || DEFAULT_VALUE}
              displayValue={data.maritalText || DEFAULT_VALUE}
              options={[]}
            />
          </div>
          <div className={styles.infoItemBox}>
            <BasicEditorCell
              label="子女数量"
              width={INFO_ITEM_WITDH}
              className={styles.infoItem}
              editorId="person_children_num"
              onEditOK={this.updateChildNum}
              value={data.childNum}
              displayValue={data.childNum}
              checkable
              onCheck={this.checkChildNumValue}
              onSuccess={this.refreshCustProperty}
            />
          </div>
          <div className={styles.infoItemBox}>
            <BasicEditorCell
              label="爱好"
              width={INFO_ITEM_WITDH}
              className={styles.infoItem}
              editorId="person_children_num"
              onEditOK={_.noop}
              value={data.hobby || DEFAULT_VALUE}
              displayValue={data.hobby || DEFAULT_VALUE}
            />
          </div>
        </div>
      </div>
    );
  }
}
