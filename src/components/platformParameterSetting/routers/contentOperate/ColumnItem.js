/*
 * @Author: zhangjun
 * @Descripter: 栏目Item
 * @Date: 2018-11-05 15:16:43
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-08 20:19:35
 */
import React from 'react';
import PropTypes from 'prop-types';
import InfoCell from './InfoCell';
import Icon from '../../../common/Icon';

import styles from './columnItem.less';

export default function ColumnItem(props) {
  // 编辑栏目
  function handleEditColumn() {
    const { onEdit } = props;
    onEdit();
  }

  // 删除栏目
  function handleDeleteColumn() {
    props.onDelete();
  }
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
          <span className={styles.itemContent}>{name}</span>
        </InfoCell>
        <InfoCell
          label="图片链接"
        >
          <span className={styles.itemContent}>{link}</span>
        </InfoCell>
        <InfoCell
          label="功能描述"
        >
          <span className={styles.itemContent}>{description}</span>
        </InfoCell>
      </div>
      <div className={styles.itemOperate}>
        <div className={styles.edit} onClick={handleEditColumn}>
          <Icon type="shenqing" />
        </div>
        <div className={styles.defaultDelete} onClick={handleDeleteColumn}>
          <Icon type="shanchu"/>
        </div>
      </div>
    </div>
  );
}

ColumnItem.propTypes = {
  // 是否是第一个活动栏目
  isFirstColumn: PropTypes.bool,
  // 活动栏目数据
  columnData: PropTypes.object.isRequired,
  // 编辑栏目
  onEdit: PropTypes.func.isRequired,
  // 删除栏目
  onDelete: PropTypes.func.isRequired,
};
ColumnItem.defaultProps = {
  isFirstColumn: false,
};
