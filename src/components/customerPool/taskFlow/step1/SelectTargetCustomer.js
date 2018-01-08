/**
 * @file customerPool/createTask/steps/SelectTargetCustomer.js
 *  客户池-自建任务表单-选择客户
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Entry from './Entry';
import ImportCustomers from './ImportCustomers';
import SightingTelescope from './SightingTelescope';

import styles from './selectTargetCustomer.less';

export default class SelectTargetCustomer extends PureComponent {
  static propTypes = {
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
    orgId: PropTypes.string,
    isHasAuthorize: PropTypes.bool,
    filterModalvisible: PropTypes.bool,
  }

  static defaultProps = {
    isShowTitle: false,
    orgId: null,
    isHasAuthorize: false,
    filterModalvisible: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      showEntry: true,
      showImportCustomers: false,
      showSightingTelescope: false,
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
      isHasAuthorize,
      filterModalvisible,
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
          ref={r => this.importCustRef = r}
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
          storedData={storedTaskFlowData}
          orgId={orgId}
          isHasAuthorize={isHasAuthorize}
          filterModalvisible={filterModalvisible}
        />
      </div>
    );
  }
}
