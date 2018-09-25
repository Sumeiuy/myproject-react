/*
 * @Author: zhangjun
 * @Date: 2018-09-11 20:39:27
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-25 14:10:13
 * @description 投顾空间申请头部筛选
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Input, DatePicker } from 'antd';
import _ from 'lodash';
import SingleFilter from 'lego-react-filter/src';

import Button from '../common/Button';
import logable from '../../decorators/logable';

import styles from './header.less';

const Search = Input.Search;

export default class Header extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    // 筛选后调用的Function
    filterCallback: PropTypes.func,
    // 智慧前厅列表
    roomData: PropTypes.object.isRequired,
    // 新建申请弹窗
    creatModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    filterCallback: _.noop,
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '参与人',
      value: '$args[0]',
    },
  })
  handleParticipantSearch(value) {
    this.props.filterCallback({'participant': value});
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '智慧前厅',
      value: '$args[0].value.value',
    },
  })
  handleRoomChange(option) {
    const { value: { value } } = option;
    this.props.filterCallback({'roomNo': value});
  }

  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '预约日期',
      value: '$args[1]',
    },
  })
  handleDateChange(date, dateString) {
    this.props.filterCallback({'orderDate': dateString});
  }

  // 新建申请
  @autobind
  @logable({ type: 'Click', payload: { name: '新建' } })
  handleCreate() {
    this.props.creatModal();
  }

  render() {
    const {
      roomData: {
        smartFrontHallList,
      },
      empInfo: {
        empInfo: {
          tgQyFlag
        }
      },
      location: {
        query: {
          roomNo = '',
        },
      },
    } = this.props;
    // 处理智慧前厅头部筛选项，增加不限筛选项
    const defaultRoomList = smartFrontHallList || [];
    const roomList = [ { label: '不限', value: '' }, ...defaultRoomList ];
    return (
      <div className={styles.Header}>
        <div className={styles.filterBox}>
          <div className={styles.filter}>
            <div className={styles.filterFl}>
              <Search
                className={styles.filterParticipant}
                placeholder="参与人"
                onSearch={this.handleParticipantSearch}
                style={{ width: 160, height: 30 }}
              />
            </div>
            <SingleFilter
              className={styles.filterFl}
              filterName='智慧前厅'
              filterId= 'room'
              dataMap={['value', 'label']}
              filterOption={['room']}
              data={roomList}
              value={roomNo}
              onChange={this.handleRoomChange}
              needItemObj
            />
            <div className={styles.filterFl}>
              <div className={styles.filterOrderDateWrapper}>
                <span className={styles.label}>预约日期：</span>
                <DatePicker
                  onChange={this.handleDateChange}
                  className={styles.filterOrderDate}
                />
              </div>

            </div>

          </div>
        </div>
        {
          tgQyFlag ?
            <Button
              type="primary"
              icon="plus"
              size="small"
              onClick={this.handleCreate}
            >
              新建
            </Button>
            :
            null
        }
      </div>
    );
  }
}
