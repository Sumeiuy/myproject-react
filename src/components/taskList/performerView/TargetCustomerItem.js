import React, { PropTypes } from 'react';
// import _ from 'lodash';
import Icon from '../../common/Icon';
import styles from './targetCustomerItem.less';

export default function TargetCustomerItem(props) {
  const { isShowIcon = false, isShowNum = false } = props;
  return (
    <div>
      {
        isShowIcon ?
          <h5 className={styles.people}><span>总资产：</span><span>2345.78万元</span><Icon type="info-circle-o" /></h5>
        :
          <h5 className={styles.people}><span>联系电话：</span><span>15357890001</span></h5>
      }
      {
        isShowNum ?
          <h5 className={styles.people}>
            <span>持仓资产：</span><span>2345.78万元</span>/<span>99.5%</span>
          </h5>
        :
          <h5 className={styles.people}><span>联系电话：</span><span>15357890001</span></h5>
      }

    </div>
  );
}

TargetCustomerItem.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  executeTypes: PropTypes.array,
  isShowIcon: PropTypes.bool,
  isShowNum: PropTypes.bool,
};

TargetCustomerItem.defaultProps = {
  content: '--',
  title: '--',
  type: 'left',
  executeTypes: [],
  isShowIcon: false,
  isShowNum: false,
};
