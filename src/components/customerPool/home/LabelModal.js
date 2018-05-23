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
import { Modal, Button, Tabs, Popover } from 'antd';
import _ from 'lodash';
import Pagination from '../../common/Pagination';
import styles from './labelModal.less';
import config from './config';

const PAGE_SIZE = 20;
const TabPane = Tabs.TabPane;
const { labelModal: { tabList } } = config;
export default class LabelModals extends PureComponent {
  static propTypes = {
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

  constructor(props) {
    super(props);
    this.state = {
      activeKey: tabList[0].key,
    };
  }

  componentDidMount() {
    const { queryCustLabelList } = this.props;
    queryCustLabelList();
    console.log('didmount');
  }

  @autobind
  getTabPaneList() {
    return tabList.map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  @autobind
  handleTabChange(activeKey) {
    this.setState({
      activeKey,
    });
  }

  @autobind
  handlePageChange(pageNo) {
    const { pageChange } = this.props;
    pageChange({
      pageNo,
      pageSize: PAGE_SIZE,
    });
    console.log(pageNo);
  }

  // 设置 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (!_.isEmpty(value)) {
      reactElement = (<Popover
        placement="bottomLeft"
        content={value}
        trigger="hover"
        overlayStyle={{}}
      >
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '调仓理由：暂无';
    }
    return reactElement;
  }

  render() {
    const {
      show,
      toggleModal,
      // data,
    } = this.props;
    // const { page } = data;
    const footerContent = (<Button
      key="close"
      onClick={() => toggleModal(false)}
    >
      关闭
    </Button>);
    const tabsProps = {
      type: 'card',
      onChange: this.handleTabChange,
      activeKey: this.state.activeKey,
    };
    const PaginationOption = {
      // current: page.pageNum || 1,
      // total: page.totalCount || 0,
      // pageSize: page.pageSize || 10,
      current: 1,
      total: 60,
      pageSize: 20,
      onChange: this.handlePageChange,
    };
    return (
      <Modal
        title="所有可用客户标签"
        visible={show}
        footer={footerContent}
        wrapClassName={styles.modal}
        onCancel={() => toggleModal(false)}
      >
        <div>
          <Tabs {...tabsProps}>
            {
              this.getTabPaneList()
            }
          </Tabs>
          <div className={styles.listBox}>
            <div className={styles.itemBox}>
              <span>瞄准镜标签1</span>
            </div>
          </div>
          <Pagination {...PaginationOption} />
        </div>
      </Modal>
    );
  }
}
