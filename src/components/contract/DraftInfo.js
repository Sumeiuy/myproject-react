/*
* @Description: 合作合约修改/新建 -拟稿信息
* @Author: XuWenKang
* @Date:   2017-09-20 16:53:31
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-20 17:05:11
*/

import React, { PureComponent } from 'react';
// import { autobind } from 'core-decorators';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';

import styles from './draftinfo.less';

export default class DraftInfo extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="拟稿信息" />
        <InfoItem label="拟稿人" value="南京分公司长江路" />
        <InfoItem label="提请时间" value="2017/08/31" />
        <InfoItem label="状态" value="已完成" />
      </div>
    );
  }

}
