/**
 * @Description: 大类资产配置分析豆腐块
 * @Author: Liujianshu
 * @Date: 2018-06-20 14:02:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-30 11:00:18
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Tabs } from 'antd';

import { openRctTab } from '../../../utils';
import { url as urlHelper } from '../../../helper';
import Icon from '../../common/Icon';
import logable from '../../../decorators/logable';
import Item from './Item';
import Modal from './Modal';
import config from '../config';
import styles from './home.less';

const TabPane = Tabs.TabPane;
const { majorAssets: { tabArray } } = config;
// 详情弹窗的 key
const MODAL_KEY = 'detailModalVisible';
export default class MajorAssets extends PureComponent {
  static propTypes = {
    indexData: PropTypes.object.isRequired,
    detail: PropTypes.object.isRequired,
    getDetail: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      [MODAL_KEY]: false,
      activeKey: tabArray[0].key,
    };
  }

  // 切换 TAB
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '切换Tab：每周观点/战术配置/战略配置',
      type: '大类资产配置分析',
      subtype: '$args[0]',
    },
  })
  handleTabsChange(key) {
    this.setState({
      activeKey: key,
    });
  }

  // 打开弹窗
  @autobind
  openModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  // 点击更多事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '更多',
      type: '大类资产配置分析最新观点',
    },
  })
  handleMoreClick() {
    const { push } = this.context;
    const { activeKey } = this.state;
    const activeObj = _.find(tabArray, o => o.key === activeKey);
    const param = {
      id: 'RTC_TAB_MAJOR_ASSETS_LIST',
      title: '大类资产配置分析最新观点',
    };
    const query = {
      type: activeObj.id || '',
    };
    const pathname = '/latestView/majorAssetsList';
    const url = `/latestView/majorAssetsList?${urlHelper.stringify(query)}`;
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname,
      query,
    });
  }

  render() {
    const { indexData, detail, getDetail } = this.props;
    const { activeKey } = this.state;
    if (_.isEmpty(indexData)) {
      return null;
    }
    const tabPaneData = (indexData[activeKey] && indexData[activeKey].list) || [];
    return (
      <div className={styles.majorAssetsWrapper}>
        <div className={styles.headerBox}>
          <Icon type="daleizichanpeizhifenxi" />
          <span>大类资产配置分析</span>
          <a onClick={this.handleMoreClick}>更多</a>
        </div>
        <Tabs activeKey={activeKey} onChange={this.handleTabsChange}>
          {
            tabArray.map(item =>
              <TabPane
                tab={
                  indexData[item.key].hasNew
                  ?
                    <span className={styles.newIcon}>{item.name}<Icon type="new1" /></span>
                  :
                    item.name
                }
                key={item.key}
              >
                <div className={styles.itemList}>
                  {
                    tabPaneData.map((child, index) => <Item
                      data={child}
                      isEven={index % 2 === 0}
                      modalKey={MODAL_KEY}
                      openModal={this.openModal}
                      getDetail={getDetail}
                      key={child.id}
                    />)
                  }
                </div>
              </TabPane>,
            )
          }
        </Tabs>
        <Modal
          modalKey={MODAL_KEY}
          visible={this.state[MODAL_KEY]}
          closeModal={this.closeModal}
          data={detail}
        />
      </div>
    );
  }
}
