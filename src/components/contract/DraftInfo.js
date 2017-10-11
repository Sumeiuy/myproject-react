/*
* @Description: 合作合约修改/新建 -拟稿信息
* @Author: XuWenKang
* @Date:   2017-09-20 16:53:31
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-11 10:22:42
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';

import styles from './draftinfo.less';

export default class DraftInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const { data: { name, date, status } } = this.props;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="拟稿信息" />
        <InfoItem label="拟稿人" value={name} />
        <InfoItem label="提请时间" value={date} />
        <InfoItem label="状态" value={status} />
      </div>
    );
  }

}
