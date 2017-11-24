/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PropTypes, PureComponent } from 'react';
import styles from './targetCustomer.less';
import TargetCustomerRight from './TargetCustomerRight';
import LabelInfo from './LabelInfo';


const datas = {};

export default class TargetCustomer extends PureComponent {
  static propTypes = {
    isFold: PropTypes.bool.isRequired,
    handleCollapseClick: PropTypes.func.isRequired,
    dict: PropTypes.object,
    getServiceRecord: PropTypes.func.isRequired,
    serviceRecordData: PropTypes.object,
  }

  static defaultProps = {
    dict: {},
    serviceRecordData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  render() {
    const { isFold, handleCollapseClick, dict, getServiceRecord, serviceRecordData } = this.props;
    const { executeTypes, serveWay } = dict;
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.left}>
          表格
        </div>
        <div className={styles.right}>
          <TargetCustomerRight
            isFold={isFold}
            itemData={datas}
            handleCollapseClick={handleCollapseClick}
            serveWay={serveWay}
            executeTypes={executeTypes}
            getServiceRecord={getServiceRecord}
            serviceRecordData={serviceRecordData}
          />
        </div>
      </div>
    );
  }
}
