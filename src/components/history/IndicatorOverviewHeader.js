/**
 * @fileOverview components/pageCommon/PageHeader.js
 * @author sunweibin
 * @description 用于业绩页面头部区域模块
 */

import React, { PropTypes, PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { Icon, Button } from 'antd';
import { DeleteHistoryBoardModal } from '../../components/modals';
// import Icon from '../common/Icon';

// 选择项字典
import styles from './indicatorOverviewHeader.less';

export default class PageHeader extends PureComponent {
  static PropTypes = {
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return (
      <div className={styles.indicatorOverviewHeader}>
        <div className={styles.analyticalCaption}>核心指标</div>
        <div className={styles.overviewHeaderRight}>
          <Button
            type="primary"
            ghost
            onClick={this.showModal}
          >
            <Icon type="delete" />
            保存
          </Button>
          <DeleteHistoryBoardModal
            ref={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <Button
            ghost
          >
            <Icon type="delete" />
            另存为
          </Button>
          <Button
            ghost
          >
            <Icon type="delete" />
            删除
          </Button>
        </div>
      </div>
    );
  }
}
