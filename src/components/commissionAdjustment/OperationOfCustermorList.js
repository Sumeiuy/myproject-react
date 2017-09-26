/**
 * @file components/commissionAdjustment/OperationOfCustermorList
 * @description 新建批量佣金调整客户列表选择和移除
 * @author baojiajia
 */
import React, { PureComponent, PropTypes } from 'react';
import { Button } from 'antd';
import SearchSelect from '../common/Select/SearchSelect';
import styles from './operationOfCustermorList.less';


export default class ProductsDropdownBox extends PureComponent {
  static propTypes = {
    labelName: PropTypes.string.isRequired,
    dataSource: PropTypes.array.isRequired,
    onAddCustomer: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onDelectCustomer: PropTypes.func.isRequired,
  }

  render() {
    const { labelName, dataSource, onAddCustomer, onChangeValue, onDelectCustomer } = this.props;
    return (
      <div className={styles.operationOfCustList}>
        <div className={styles.searchSelectArea}>
          <SearchSelect
            onAddCustomer={onAddCustomer}
            onChangeValue={onChangeValue}
            width="184px"
            labelName={labelName}
            dataSource={dataSource}
          />
        </div>
        <Button className={styles.delectCustomerButton} onClick={onDelectCustomer}>移除</Button>
      </div>
    );
  }
}

