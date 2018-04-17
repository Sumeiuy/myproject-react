/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-16 13:31:32
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
// import _ from 'lodash';

import config from './config';
import CommonTable from '../../../components/common/biz/CommonTable';
import { seibelConfig } from '../../../config';
import logable from '../../../decorators/logable';

import styles from './feedbackAdd.less';

// 角色可选项配置
const ROLE_TYPE = config.roleType;
const Search = Input.Search;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const { customerFeedback: { parentTitleList, childTitleList } } = seibelConfig;

export default class MissionBind extends PureComponent {
  static propTypes = {
    // 获取客户反馈列表
    queryFeedbackList: PropTypes.func.isRequired,
    // 客户反馈列表
    feedbackData: PropTypes.object.isRequired,
    // 可选项角色类型
    roleType: PropTypes.string.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      currentFeedback: EMPTY_OBJECT,
      keyword: '',
    };
  }

  componentDidMount() {
    const { queryFeedbackList, roleType } = this.props;
    queryFeedbackList({ roleType });
  }

  // 向父组件提供数据
  @autobind
  getData() {
    const { currentFeedback } = this.state;
    return currentFeedback;
  }

  // 查询客户反馈
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索客户反馈',
      value: '$args[0]',
    },
  })
  handleSearchFeedback(keyword) {
    const { queryFeedbackList, roleType } = this.props;
    this.setState({
      currentFeedback: EMPTY_OBJECT,
    }, () => {
      queryFeedbackList({ keyword, roleType });
    });
  }

  @autobind
  handleChangeKeyword(e) {
    if (e.target.value.length >= 30) {
      return;
    }
    this.setState({
      keyword: e.target.value,
    });
  }

  // 选中一级客户反馈
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '选中一级客户反馈',
    },
  })
  handleSelectRow(currentFeedback) {
    this.setState({
      currentFeedback,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: 'Page',
      value: '$args[0]',
    },
  })
  handlePageChange(value) {
    const { keyword } = this.state;
    const { queryFeedbackList, roleType } = this.props;
    queryFeedbackList({ keyword, pageNum: value, roleType });
  }

  render() {
    const {
      currentFeedback,
      keyword,
    } = this.state;
    const {
      feedbackData,
      roleType,
    } = this.props;
    // 是否是服务经理可选项
    const isCustomer = roleType === ROLE_TYPE[0].key;
    const feedbackDataPage = feedbackData.page || EMPTY_OBJECT;
    const feedbackList = feedbackData.feedbackList || EMPTY_LIST;
    const childList = currentFeedback.childList || EMPTY_LIST;

    const pagination = {
      onChange: this.handlePageChange,
      pageSize: Number(feedbackDataPage.pageSize),
      current: Number(feedbackDataPage.pageNum),
      total: Number(feedbackDataPage.totalCount),
    };

    return (
      <div className={styles.feedbackAddWapper}>
        <div className={styles.searchBox}>
          <Search
            onSearch={this.handleSearchFeedback}
            onChange={this.handleChangeKeyword}
            style={{ width: 320 }}
            value={keyword}
            enterButton
          />
        </div>
        <div className={styles.tableBox}>
          <div className={styles.leftTable} style={{ width: isCustomer ? '338px' : '580px' }}>
            <CommonTable
              titleList={parentTitleList}
              data={feedbackList}
              pagination={pagination}
              scroll={{ y: 240 }}
              onRow={record => ({
                onClick: () => this.handleSelectRow(record),       // 点击行
              })}
              rowClassName={record => (record.id === currentFeedback.id ? 'current' : '')}
            />
          </div>
          {
            isCustomer
            ?
              <div className={styles.rightTable}>
                <CommonTable
                  titleList={childTitleList}
                  data={childList}
                  scroll={{ y: 240 }}
                />
              </div>
            :
              null
          }
        </div>
      </div>
    );
  }
}
