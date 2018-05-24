/**
 * @Author: XuWenKang
 * @Description: 首页-展示更多标签弹窗
 * @Date: 2018-05-23 11:10:49
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-23 19:58:20
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal, Tabs, Popover } from 'antd';
// import _ from 'lodash';
import logable from '../../../decorators/logable';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import { isSightingScope, getFilter } from '../helper';
import { padSightLabelDesc } from '../../../config';
import Pagination from '../../common/Pagination';
import styles from './labelModal.less';
import config from './config';

// 标签的类型值
const LABEL = 'LABEL';
const PAGE_SIZE = 20;
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
const TabPane = Tabs.TabPane;
const { labelModal: { tabList } } = config;
export default class LabelModals extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询数据
    queryCustLabelList: PropTypes.func.isRequired,
    // 是否显示弹窗
    show: PropTypes.bool.isRequired,
    // 打开关闭弹窗
    toggleModal: PropTypes.func.isRequired,
    // 数据分页
    pageChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  static contextTypes = {
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: tabList[0].key,
    };
  }

  componentDidMount() {
    const { queryCustLabelList } = this.props;
    const { activeKey } = this.state;
    queryCustLabelList({
      type: activeKey,
    });
  }

  @autobind
  getTabPaneList() {
    return tabList.map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  @autobind
  getListItem() {
    const { data: { list = EMPTY_LIST } } = this.props;
    return list.map(item => (
      <div className={styles.itemBox} key={item.id}>
        {this.renderPopover(item)}
      </div>
    ));
  }

  // tab切换
  @autobind
  handleTabChange(activeKey) {
    const { queryCustLabelList } = this.props;
    queryCustLabelList({
      type: activeKey,
    });
    this.setState({
      activeKey,
    });
  }

  // 翻页
  @autobind
  handlePageChange(pageNo) {
    const { pageChange } = this.props;
    pageChange({
      pageNo,
      pageSize: PAGE_SIZE,
    });
  }

  // 打开持仓查客户
  @autobind
  @logable({ type: 'Click', payload: { name: '目标客户池首页点击推荐词' } })
  handleOpenTab(options) {
    const { push } = this.context;
    const { location: { query } } = this.props;
    const firstUrl = '/customerPool/list';
    const condition = urlHelper.stringify({ ...options, filters: getFilter(options) });
    const url = `${firstUrl}?${condition}`;
    const param = {
      closable: true,
      forceRefresh: true,
      isSpecialTab: true,
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '客户列表',
    };
    openRctTab({
      routerAction: push,
      url,
      param,
      pathname: firstUrl,
      query: options,
      // 方便返回页面时，记住首页的query，在本地环境里
      state: {
        ...query,
      },
    });
  }

  @autobind
  openClientListPage(item) {
    const options = {
      source: isSightingScope(item.source) ? 'sightingTelescope' : 'tag',
      labelMapping: item.id || '',
      labelName: encodeURIComponent(item.name),
      labelDesc: encodeURIComponent(item.description),
      // 任务提示
      missionDesc: padSightLabelDesc({
        sightingScopeBool: isSightingScope(item.source),
        labelId: item.id,
        labelName: item.name,
      }),
      q: encodeURIComponent(item.name),
      type: LABEL,
    };
    this.handleOpenTab(options);
  }

  @autobind
  closeModal() {
    const { toggleModal } = this.props;
    this.handleTabChange(tabList[0].key);
    toggleModal(false);
  }

  // 设置 popover
  @autobind
  renderPopover(item) {
    return (<Popover
      placement="bottomLeft"
      content={item.description}
      trigger="hover"
      overlayStyle={{}}
      title={item.name}
    >
      <a onClick={() => this.openClientListPage(item)}>{item.name}</a>
    </Popover>);
  }

  render() {
    const {
      show,
      data,
    } = this.props;
    const { page = EMPTY_OBJECT } = data;
    const tabsProps = {
      type: 'card',
      onChange: this.handleTabChange,
      activeKey: this.state.activeKey,
    };
    const PaginationOption = {
      current: page.pageNum || 1,
      total: page.totalCount || 0,
      pageSize: page.pageSize || 10,
      onChange: this.handlePageChange,
    };
    return (
      <Modal
        title="所有可用客户标签"
        visible={show}
        footer={null}
        wrapClassName={styles.modal}
        onCancel={this.closeModal}
        maskClosable={false}
      >
        <div>
          <Tabs {...tabsProps}>
            {
              this.getTabPaneList()
            }
          </Tabs>
          <div className={styles.listBox}>
            {
              this.getListItem()
            }
          </div>
          <Pagination {...PaginationOption} />
        </div>
      </Modal>
    );
  }
}
