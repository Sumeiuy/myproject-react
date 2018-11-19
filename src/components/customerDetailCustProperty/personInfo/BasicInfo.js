/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-21 17:34:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Select } from 'antd';
import _ from 'lodash';

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
const Option = Select.Option;

export default class BasicInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
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
              onChange={_.noop}
              editable
              mode="select"
              value={data.maritalText || DEFAULT_VALUE}
            />
            {/*<InfoItem
              width={INFO_ITEM_WITDH_110}
              label="婚姻状况"
              value={data.maritalText || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.maritalText || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />*/}
          </div>
          <div className={styles.infoItemBox}>
            <BasicEditorCell
              label="子女数量"
              width={INFO_ITEM_WITDH}
              className={styles.infoItem}
              editorId="person_children_num"
              onChange={_.noop}
              editable
              value={data.childNum}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="爱好"
              value={data.hobby || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.hobby || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
        </div>
      </div>
    );
  }
}
