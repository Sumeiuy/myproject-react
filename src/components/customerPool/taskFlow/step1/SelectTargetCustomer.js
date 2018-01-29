/**
 * @file customerPool/taskFlow/steps/SelectTargetCustomer.js
 *  客户池-自建任务表单-选择客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Entry from './Entry';
import ImportCustomers from './ImportCustomers';
import SightingTelescope from './SightingTelescope';
import RestoreScrollTop from '../../../../decorators/restoreScrollTop';

import styles from './selectTargetCustomer.less';

@RestoreScrollTop
export default class SelectTargetCustomer extends PureComponent {
  static propTypes = {
    currentEntry: PropTypes.number,
    dict: PropTypes.object.isRequired,
    isShowTitle: PropTypes.bool,
    onPreview: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,

    onCancel: PropTypes.func.isRequired,
    isLoadingEnd: PropTypes.bool.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    getLabelInfo: PropTypes.func.isRequired,
    peopleOfLabelData: PropTypes.object.isRequired,
    getLabelPeople: PropTypes.func.isRequired,
    orgId: PropTypes.string.isRequired,
    isAuthorize: PropTypes.bool,
    filterModalvisible: PropTypes.bool,
    getFiltersOfSightingTelescope: PropTypes.func.isRequired,
    sightingTelescopeFilters: PropTypes.object.isRequired,
  }

  static defaultProps = {
    // 默认不展示入口
    currentEntry: -1,
    isShowTitle: false,
    isAuthorize: false,
    filterModalvisible: false,
  }

  constructor(props) {
    super(props);
    const { currentEntry } = props;
    this.state = {
      // -1不展示入口
      showEntry: currentEntry === -1,
      // 展示入口1，导入客户
      showImportCustomers: currentEntry === 0,
      // 展示入口2，瞄准镜标签
      showSightingTelescope: currentEntry === 1,
    };
  }

  getData() {
    const { showSightingTelescope } = this.state;
    // current为0 时 表示当前是导入客户
    // 为1 时 表示当前是瞄准镜
    return {
      currentEntry: +showSightingTelescope,
      importCustomers: this.importCustRef.getFileData(),
      sightingTelescope: this.sightingTelescopeRef.getData(),
    };
  }

  @autobind
  importCustomers() {
    this.setState({
      showEntry: false,
      showImportCustomers: true,
      showSightingTelescope: false,
    });
  }

  @autobind
  findPeople() {
    this.setState({
      showEntry: false,
      showImportCustomers: false,
      showSightingTelescope: true,
    });
  }

  render() {
    const {
      dict,
      isShowTitle,
      onPreview,
      priviewCustFileData,
      storedTaskFlowData,

      onCancel,
      isLoadingEnd,
      circlePeopleData,
      getLabelInfo,
      peopleOfLabelData,
      getLabelPeople,
      orgId,
      isAuthorize,
      filterModalvisible,
      getFiltersOfSightingTelescope,
      sightingTelescopeFilters,
    } = this.props;
    const {
      showEntry,
      showImportCustomers,
      showSightingTelescope,
    } = this.state;
    return (
      <div>
        {isShowTitle && <div className={styles.title}>选择目标客户</div>}
        <Entry
          visible={showEntry}
          importCustomers={this.importCustomers}
          findPeople={this.findPeople}
        />
        <ImportCustomers
          ref={inst => this.importCustRef = inst}
          visible={showImportCustomers}
          switchTo={this.findPeople}
          onPreview={onPreview}
          priviewCustFileData={priviewCustFileData}
          storedTaskFlowData={storedTaskFlowData}
        />
        <SightingTelescope
          ref={r => this.sightingTelescopeRef = r}
          dict={dict}
          visible={showSightingTelescope}
          switchTo={this.importCustomers}
          onCancel={onCancel}
          isLoadingEnd={isLoadingEnd}
          circlePeopleData={circlePeopleData}
          getLabelInfo={getLabelInfo}
          peopleOfLabelData={peopleOfLabelData}
          getLabelPeople={getLabelPeople}
          storedTaskFlowData={storedTaskFlowData}
          orgId={orgId}
          isAuthorize={isAuthorize}
          filterModalvisible={filterModalvisible}
          getFiltersOfSightingTelescope={getFiltersOfSightingTelescope}
          sightingTelescopeFilters={sightingTelescopeFilters}
        />
      </div>
    );
  }
}
