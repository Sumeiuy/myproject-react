/*
 * @Author: sunweibin
 * @Date: 2018-10-16 15:22:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 19:40:08
 * @description 更多重点标签弹出层
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Modal from '../common/biz/CommonModal';
import KeyLabelsTable from './KeyLabelsTable';
import { logCommon } from '../../decorators/logable';

import styles from './moreKeyLabelModal.less';

const TabPane = Tabs.TabPane;

const TABS = {
  definedLabels: '自定义标签',
  bigdataLabels: '大数据标签',
};

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
      // 切换标签Tab,默认展示自定义标签
      activeTabKey: 'definedLabels',
    };
  }

  // 切换重点标签的Tab
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
    logCommon({
      type: 'Click',
      payload: { name: TABS[activeTabKey] },
    });
  }

  render() {
    const { onClose, data } = this.props;
    const { activeTabKey } = this.state;
    // 大数据标签
    const bigDataLabels = _.get(data, 'bigDataLabels') || [];
    // 自定义标签
    const definedLabels = _.get(data, 'definedLabels') || [];
    return (
      <Modal
        modalKey="custKeyLabelMoreModal"
        visible
        title="客户匹配标签"
        needBtn={false}
        closeModal={onClose}
      >
        <div className={styles.wrap}>
          <Tabs
            activeKey={activeTabKey}
            defaultActiveKey="definedLabels"
            onChange={this.handleTabChange}
            animated={false}
            tabBarGutter={5}
          >
            <TabPane tab="自定义标签" key="definedLabels">
              <KeyLabelsTable
                title="自定义标签"
                labels={definedLabels}
                placeholder="还没有为该客户设置自定义标签"
              />
            </TabPane>
            <TabPane tab="大数据标签" key="bigdataLabels">
              <KeyLabelsTable
                title="大数据标签"
                labels={bigDataLabels}
                placeholder="该客户暂无匹配的大数据标签"
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
