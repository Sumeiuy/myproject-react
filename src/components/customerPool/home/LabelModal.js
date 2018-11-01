/**
 * @Author: XuWenKang
 * @Description: 首页-展示更多标签弹窗
 * @Date: 2018-05-23 11:10:49
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-01 10:56:08
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import store from 'store';
import { Modal, Tabs } from 'antd';
import _ from 'lodash';

import CommonTooltip from '../../common/biz/CommonTooltip';
import { url as urlHelper } from '../../../helper';
import { openRctTab } from '../../../utils';
import { isSightingScope, getFilter, getSortParam } from '../helper';
import { padSightLabelDesc } from '../../../config';
import Pagination from '../../common/Pagination';
import logable from '../../../decorators/logable';
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
    let newList = list;
    // 列表必须要显示满20条，如果数据不满20条，用空数据填充至20条。
    if (list.length < PAGE_SIZE) {
      newList = _.concat(list, [...Array(PAGE_SIZE - list.length)]);
    }
    return newList.map((item, index) => {
      // 判断数据是否为空，为空则渲染空div,用来样式上填满容器
      let element;
      if (!_.isEmpty(item)) {
        element = (<div className={styles.itemBox} key={item.id}>
          {this.renderPopover(item)}
        </div>);
      } else {
        const key = `key-${index}`;
        element = <div className={styles.itemBox} key={key} />;
      }
      return element;
    });
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
  handleOpenTab(data) {
    const { labelDesc, missionDesc, ...options } = data;
    const { push } = this.context;
    const { location: { query } } = this.props;
    // 有标签描述需要将描述存到storage
    if (labelDesc) {
      store.set(`${options.labelMapping}-labelDesc`, {
        ...data,
        labelName: decodeURIComponent(options.labelName),
      });
    }
    const firstUrl = '/customerPool/list';
    const filters = getFilter(options);
    const sortParam = getSortParam(filters);
    const finalQuery = {
      ...options,
      ...sortParam,
      filters,
    };
    const condition = urlHelper.stringify({ ...finalQuery });
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

  // TODO 日志查看：页面中找不到方法 未验证
  @autobind
  @logable({ type: 'Click', payload: { name: '点击' } })
  openClientListPage(item) {
    const options = {
      source: isSightingScope(item.source) ? 'sightingTelescope' : 'tag',
      labelMapping: item.id || '',
      labelName: encodeURIComponent(item.name),
      // 任务提示
      missionDesc: padSightLabelDesc({
        sightingScopeBool: isSightingScope(item.source),
        labelId: item.id,
        labelName: item.name,
      }),
      labelDesc: item.description,
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
    return (
      <CommonTooltip
        title={item.name}
        content={item.description}
        placement="bottomLeft"
        trigger="hover"
        overlayStyle={{ maxWidth: 600 }}
      >
        <a onClick={() => this.openClientListPage(item)}>{item.name}</a>
      </CommonTooltip>
    );
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
      pageSize: page.pageSize || 20,
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
        width={650}
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
