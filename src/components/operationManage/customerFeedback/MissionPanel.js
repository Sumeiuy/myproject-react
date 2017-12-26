/* eslint-disable */
/*
 * @Description: 任务panel
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-25 16:40:07
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Tabs, Modal, Collapse, Icon, Popover, Button, Pagination } from 'antd';
import _ from 'lodash';

import styles from './missionPanel.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

// tab切换选项
const TAB_LIST = [
  {
    tabName: 'MOT任务',
    key: '1',
  },
  {
    tabName: '自建任务',
    key: '2',
  },
];

export default class MissionPanel extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      collapseActiveKey: '',
    };
  }

  componentDidMount() {

  }

  @autobind
  getFeedbackItem(list) {
    return list.map(v=>{
      const content = <ul className={styles.popoverCentent}>
                        {
                          v.childList.map((sv, si)=>(
                            <li key={sv.id}>{`${si} ${sv.name}`}</li>
                          ))
                        }
                      </ul>;
      return <div className={styles.feedbackItem}>
              <Popover placement="rightTop" content={content}>
                <span>{v.name}</span>
              </Popover>
              <Icon type="delete" />
            </div>
    })
  }

  // @autobind
  // getPanelList() {
  //   const { missionData } = this.props;
  //   missionData.missionList.map(v=>{
  //     const header = <div className={styles.collapseHead}>
  //       <span className={styles.parentClass}>产品销售类</span>
  //       <span className={styles.childClass}>客户回访类</span>
  //       <span className={styles.optionClass}>5项<Icon type='up' /><Icon type='down' /></span>
  //     </div>
  //     return <Panel header={header} key="1">
  //             <div className={styles.feedbackListBox}>
  //               {
  //                 this.getFeedbackItem(v.feedbackList)
  //               }
  //               <Button>+新增</Button>
  //             </div>
  //           </Panel>
  //   })
  // }

  render() {
    const { data } = this.props;
    const header = <div className={styles.collapseHead}>
      <span className={styles.parentClass}>{data.parentClassName}</span>
      <span className={styles.childClass}>{data.childClassName}</span>
      <span className={styles.optionClass}>{`${data.length}项`}<Icon type='up' /><Icon type='down' /></span>
    </div>;
    return (
      <Panel header={header}>
        <div className={styles.feedbackListBox}>
          {
            this.getFeedbackItem(data.feedbackList)
          }
          <Button>+新增</Button>
        </div>
      </Panel>
    );
  }
}
/* eslint-disable */