/*
 * @Author: zhangjun
 * @Descripter: 栏目Item
 * @Date: 2018-11-05 15:16:43
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-16 14:53:12
 */
import React from 'react';
import PropTypes from 'prop-types';
import InfoCell from './InfoCell';
import Icon from '../../../common/Icon';

import styles from './columnItem.less';

const EMPTY_INFO = '--';

export default function ColumnItem(props) {
  const {
    columnData: {
      attaches,
      link,
      description,
    },
  } = props;
  const { name } = attaches[0];
  return (
    <div className={styles.columnItemWrapper}>
      <div className={styles.itemInfo}>
        <InfoCell
          label="图片"
        >
          <span className={styles.itemContent} title={name}>{name}</span>
        </InfoCell>
        <InfoCell
          label="图片链接"
        >
          <span className={styles.itemContent} title={link}>{link}</span>
        </InfoCell>
        <InfoCell
          label="功能描述"
        >
          <span className={styles.itemContent} title={description}>{description || EMPTY_INFO}</span>
        </InfoCell>
      </div>
      <div className={styles.itemOperate}>
        <div className={styles.edit} onClick={props.onEdit}>
          <Icon type="shenqing" />
        </div>
        <div className={styles.defaultDelete} onClick={props.onDelete}>
          <Icon type="shanchu"/>
        </div>
      </div>
    </div>
  );
}

ColumnItem.propTypes = {
  // 活动栏目数据
  columnData: PropTypes.object.isRequired,
  // 编辑栏目
  onEdit: PropTypes.func.isRequired,
  // 删除栏目
  onDelete: PropTypes.func.isRequired,
};
