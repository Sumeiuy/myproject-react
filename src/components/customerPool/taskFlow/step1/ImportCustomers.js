/**
 * @file customerPool/taskFlow/ImportCustomers.js
 *  客户池-自建任务表单-导入客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import classnames from 'classnames';
import CustomerSegment from '../CustomerSegment';
import { fsp } from '../../../../helper';
// import CustomerSourceInput from './CustomerSourceInput';

import styles from './importCustomers.less';


export default class ImportCustomers extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
  }

  componentDidMount() {
    // 在初始化的时候，回滚fsp滚动条到顶部
    fsp.scrollToTop();
  }

  getFileData() {
    return {
      ...this.customerSegmentRef.getData(),
    };
  }

  render() {
    const {
      visible,
      onPreview,
      priviewCustFileData,
      storedTaskFlowData,
    } = this.props;
    const cls = classnames({
      [styles.hide]: !visible,
    });
    return (
      <div className={cls}>
        <div className={styles.importCustomersContent}>
          <CustomerSegment
            ref={ref => (this.customerSegmentRef = ref)}
            onPreview={onPreview}
            priviewCustFileData={priviewCustFileData}
            storedData={storedTaskFlowData}
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
