/**
 * @file customerPool/taskFlow/SightingTelescope.js
 *  客户池-自建任务表单-瞄准镜圈人
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Header from './Header';
import SelectLabelCust from '../SelectLabelCust';

import styles from './sightingTelescope.less';

export default class SightingTelescope extends PureComponent {

  static propTypes = {
    dict: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    switchTo: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    orgId: PropTypes.string,
    isHasAuthorize: PropTypes.bool,
    filterModalvisible: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    switchTo: () => { },
    orgId: null,
    isHasAuthorize: false,
    filterModalvisible: false,
  }

  getData() {
    return this.selectLabelCustRef.getData();
  }

  render() {
    const {
      dict,
      visible,
      switchTo,
      onCancel,
      isLoadingEnd,
      circlePeopleData,
      getLabelInfo,
      peopleOfLabelData,
      getLabelPeople,
      storedTaskFlowData,
      orgId,
      isHasAuthorize,
      filterModalvisible,
    } = this.props;
    const cls = classnames({
      [styles.hide]: !visible,
    });
    return (
      <div className={cls}>
        <div className={styles.header}>
          <Header
            title="瞄准镜圈人"
            switchTarget="导入客户"
            onClick={switchTo}
          />
        </div>
        <div>
          <SelectLabelCust
            dict={dict}
            onCancel={onCancel}
            isLoadingEnd={isLoadingEnd}
            visible={filterModalvisible}
            circlePeopleData={circlePeopleData}
            getLabelInfo={getLabelInfo}
            peopleOfLabelData={peopleOfLabelData}
            getLabelPeople={getLabelPeople}
            storedData={storedTaskFlowData}
            ref={ref => (this.selectLabelCustRef = ref)}
            orgId={orgId}
            isHasAuthorize={isHasAuthorize}
          />
        </div>
      </div>
    );
  }
}
