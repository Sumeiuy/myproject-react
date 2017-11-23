/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户
 */

import React, { PropTypes, PureComponent } from 'react';
import styles from './targetCustomer.less';
import TargetCustomerRight from './TargetCustomerRight';
import LabelInfo from './LabelInfo';

// 模拟接口的死数据
const data = {
  code: '200',
  msg: 'success',
  resultData: {
    page: {
      pageNo: '1',
      pageSize: '10',
      totalCount: '200',
      totalPage: '20',
    },
    list: [
      {
        custId: '002332',
        custName: '王华',
        isSign: true,
        genderValue: '男',
        age: '33',
        missionStatusCode: '106110',
        missionStatusValue: '处理中',
        levelCode: '1078',
        levelValue: '白金',
        riskLevelValue: '积极型',
        genderCode: '01',
        contactPhone: '18255353210',
        empName: '王华',
        empId: '0110102',
        empContactPhone: '18533536936',
        empDepartment: '南京长江路营业部',
        officePhone: '025-44544646455646',
        homePhone: '025-89898933',
        cellPhone: '18255353210',
        assets: '1000000000',
        openAssets: '10000000',
        availablBalance: '100000',
        commissionRate: '0.2',
        hsRate: '0.3',
        openBusiness: '创业板、深港通、沪港通',
        openedBusiness: '创业板',
        recentServiceTime: '2017/11/11',
        missionTitle: 'XXOO',
        missionType: 'OOXX',
        custUuid: '',
      },
    ],
  },
};


export default class TargetCustomer extends PureComponent {
  static propTypes = {
    isFold: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  render() {
    const { isFold } = this.props;
    return (
      <div className={styles.targetCustomer}>
        <LabelInfo value="目标客户" />
        <div className={styles.left}>
          表格
        </div>
        <div className={styles.right}>
          <TargetCustomerRight
            isFold={isFold}
            itemData={data.resultData.list[0]}
          />
        </div>
      </div>
    );
  }
}
