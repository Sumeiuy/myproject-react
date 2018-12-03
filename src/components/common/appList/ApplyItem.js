/**
 * @Author: sunweibin
 * @Date: 2018-07-06 15:36:38
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-26 16:06:25
 * @description 为所有的申请单类型列表中的每一项创建更加通用的申请单组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../tag';
import Icon from '../Icon';

import { data as dataHelper } from '../../../helper';

import styles from './applyItem.less';

const StatusTag = Tag.statusTag;

export default function ApplyItem(props) {
  const {
    data,
    index,
    iconType,
    typeName,
    typeNameClass,
    statusTags,
    subTypeName,
    active,
    onClick,
    showThirdLineInfo,
    showSecondLineInfo,
  } = props;

  // 给组件添加选中状态下的 className
  const activeCls = { [styles.active]: active };
  const typeNameCls = typeNameClass ? { [styles[typeNameClass]]: true } : '';
  const applyItemCls = cx(styles.applyItem, activeCls);
  const appIconCls = cx(styles.appIcon, activeCls);
  const serialCls = cx(styles.serialNumber, activeCls);
  const typeCls = cx({
    [styles.type]: true,
    ...activeCls,
    ...typeNameCls,
  });
  const secondLineCls = cx(styles.secondLine, activeCls);
  const thirdLineCls = cx(styles.thirdLine, activeCls);

  // 第二行信息
  const secondLineInfo = showSecondLineInfo(data);
  // 展示客户信息
  const thirdLineInfo = showThirdLineInfo(data);
  const secondLineValue = showSecondLineInfo === _.noop ? `${(data.createTime && data.createTime.slice(0, 10)) || '无'}` : secondLineInfo;
  const thirdLineValue = showThirdLineInfo === _.noop ? `客户：${data.custName || '无'}(${data.custNumber || '无'})` : thirdLineInfo;
  // 针对选中状态下的申请单状态标签type做处理，如果申请单是选中状态则type为ghost
  const tags = _.map(statusTags, (tag) => {
    if (active) {
      return {
        key: dataHelper.uuid(),
        ...tag,
        type: 'ghost',
      };
    }
    return {
      ...tag,
      key: dataHelper.uuid(),
    };
  });

  return (
    <div className={applyItemCls} onClick={() => onClick(data, index)}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.titleArea}>
          <Icon type={iconType} className={appIconCls} />
          <span className={serialCls}>
编号
            {data.id || '暂无'}
          </span>
          <span className={typeCls}>{typeName}</span>
        </div>
        <div className={styles.tagArea}>
          {
            _.map(tags, tagProps => <StatusTag {...tagProps} />)
          }
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        <div className={styles.subType}>{subTypeName}</div>
        <div className={styles.date}>{secondLineValue}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>
拟稿人：
          <span className={styles.drafterName}>
            {data.empName}
(
            {data.empId}
)
          </span>
          {`${data.orgName || ''}` || '无'}
        </div>
        <div className={styles.customer} title={thirdLineValue}>{thirdLineValue}</div>
      </div>
    </div>
  );
}

ApplyItem.propTypes = {
  // 申请单项的基本数据
  data: PropTypes.object.isRequired,
  // 数据在申请单列表数据中的小标索引值
  index: PropTypes.number.isRequired,
  // 申请单的Icon type
  iconType: PropTypes.string.isRequired,
  // 类型，展示在申请单项第一行编号后面的类型文字
  typeName: PropTypes.string,
  // 类型文字的样式类型
  typeNameClass: PropTypes.string,
  // 子类型，展示在申请单项第二行的类型文本
  subTypeName: PropTypes.string.isRequired,
  // 申请单项的右侧展示状态标签 Props 的数组
  // [{ size: 'normal', type: 'processing',text: '处理中', style: {} }, ...]
  statusTags: PropTypes.array.isRequired,
  // 是否选中状态,选中状态需要展示镂空样式
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  // 展示第二行中的信息，返回值为字符串
  showSecondLineInfo: PropTypes.func,
  // 展示第三行中的客户信息，由于部分申请单有多个客户，展示多个客户和单个不一样所以提供函数由用户自己控制
  // 其返回值为字符串
  showThirdLineInfo: PropTypes.func,
};

ApplyItem.defaultProps = {
  typeName: '',
  typeNameClass: '',
  active: false,
  showSecondLineInfo: _.noop,
  showThirdLineInfo: _.noop,
};
