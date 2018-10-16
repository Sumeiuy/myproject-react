/*
 * @Author: sunweibin
 * @Date: 2018-10-16 15:22:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-16 15:59:02
 * @description 更多重点标签弹出层
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Modal from '../common/biz/CommonModal';
import KeyLabelsTable from './KeyLabelsTable';

import styles from './moreKeyLabelModal.less';

const TabPane = Tabs.TabPane;

export default class MoreKeyLabelsModal extends Component {
  static propTypes = {
    // 更多重点标签数据
    data: PropTypes.object.isRequired,
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 切换标签Tab,默认展示大数据标签
      activeTabKey: 'bigdataLabels',
    };
  }

  // 切换重点标签的Tab
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
  }


  render() {
    const { onClose, data } = this.props;
    const { activeTabKey } = this.state;
    // 大数据标签
    const bigDataLabels = _.get(data, 'bigDataLabels.labelList') || [];
    // 自定义标签
    const customerLabels = _.get(data, 'customerLabels.labelList') || [];
    return (
      <Modal
        modalKey="custKeyLabelMoreModal"
        visible
        title="重点标签"
        needBtn={false}
        closeModal={onClose}
      >
        <div className={styles.wrap}>
          <Tabs
            activeKey={activeTabKey}
            defaultActiveKey="bigdataLabels"
            onChange={this.handleTabChange}
            animated={false}
            tabBarGutter={5}
          >
            <TabPane tab="大数据标签" key="bigdataLabels">
              <KeyLabelsTable labels={bigDataLabels} />
            </TabPane>
            <TabPane tab="自定义标签" key="customerLabels">
              <KeyLabelsTable labels={customerLabels} />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

