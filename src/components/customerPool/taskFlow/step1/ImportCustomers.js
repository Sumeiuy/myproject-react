/**
 * @file customerPool/taskFlow/ImportCustomers.js
 *  客户池-自建任务表单-导入客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import classnames from 'classnames';

import Header from './Header';
import CustomerSegment from '../CustomerSegment';
// import CustomerSourceInput from './CustomerSourceInput';

import styles from './importCustomers.less';


export default class ImportCustomers extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    switchTo: PropTypes.func,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    isSendCustsServedByPostn: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
    switchTo: () => { },
  }

  getFileData() {
    return {
      ...this.customerSegmentRef.getData(),
      // customerSourceForm: this.customerSourceRef,
    };
  }

  render() {
    const {
      visible,
      switchTo,
      onPreview,
      priviewCustFileData,
      storedTaskFlowData,
      isSendCustsServedByPostn,
    } = this.props;
    const cls = classnames({
      [styles.hide]: !visible,
    });
    return (
      <div className={cls}>
        <div className={styles.header}>
          <Header
            title="导入客户"
            switchTarget="瞄准镜圈人"
            onClick={switchTo}
          />
        </div>
        <div className={styles.importCustomersContent}>
          <CustomerSegment
            ref={ref => (this.customerSegmentRef = ref)}
            onPreview={onPreview}
            priviewCustFileData={priviewCustFileData}
            storedData={storedTaskFlowData}
            isSendCustsServedByPostn={isSendCustsServedByPostn}
          />
          {/*
            <CustomerSourceInput
              ref={r => this.customerSourceRef = r}
              defaultValue={storedTaskFlowData.customerSource}
            />
           */}
        </div>
      </div>
    );
  }
}
