/*
 * @Author: LiuJianShu
 * @Date: 2017-12-21 15:01:59
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-22 10:23:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { withRouter } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { message } from 'antd';

import Button from '../../components/common/Button';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import config from './config';
import styles from './home.less';

const { titleList } = config;
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});
const mapStateToProps = state => ({
  employeeList: state.mainPosition.employeeList,
  positionList: state.mainPosition.positionList,
});

const mapDispatchToProps = {
  // 搜索员工列表
  searchEmployee: fetchDataFunction(true, 'mainPosition/searchEmployee'),
  // 搜索员工职位列表
  searchPosition: fetchDataFunction(true, 'mainPosition/searchPosition'),
  // 设置主职位
  updatePosition: fetchDataFunction(true, 'mainPosition/updatePosition'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class MainPosition extends PureComponent {
  static propTypes = {
    searchEmployee: PropTypes.func.isRequired,
    searchPosition: PropTypes.func.isRequired,
    updatePosition: PropTypes.func.isRequired,
    employeeList: PropTypes.array.isRequired,
    positionList: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const h = document.body.clientHeight;
    this.state = {
      height: `${h - 40}px`,
      checkedRadio: -1,
      checkedEmployee: {},
      employeeId: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { positionList: prePL } = this.props;
    const { positionList: nextPL } = nextProps;
    if (prePL !== nextPL) {
      const checkedRadio = _.findIndex(nextPL, ['primary', true]);
      this.setState({
        checkedRadio,
      });
    }
  }

  @autobind
  onSubmit() {
    const { checkedEmployee, employeeId } = this.state;
    const { updatePosition } = this.props;
    if (!_.isEmpty(checkedEmployee)) {
      updatePosition({
        employeeId,
        positionId: checkedEmployee.positionId,
      }).then(() => {
        message.success('提交成功');
      });
    }
  }

  @autobind
  checkTableData(record, index) {
    console.warn(record, index);
    this.setState({
      checkedRadio: index,
      checkedEmployee: record,
    });
  }

  @autobind
  selectHandle(value) {
    const { searchPosition } = this.props;
    searchPosition({
      login: value.login,
      integrationId: '123', // 测试数据
    }).then(() => {
      this.setState({
        employeeId: value.login,
      });
    });
  }

  @autobind
  searchHandle(value) {
    const { searchEmployee } = this.props;
    if (_.isEmpty(value)) {
      message.error('请输入工号或姓名');
      return;
    }
    searchEmployee({
      keyword: value,
    });
  }

  render() {
    const { height, checkedRadio } = this.state;
    const { employeeList, positionList } = this.props;
    const operation = {
      column: {
        key: 'radio',
        title: '设为主要',
        align: 'right',
        radio: checkedRadio,
      },
      operate: this.checkTableData,
    };
    return (
      <div className={styles.mainPositionWrapper} style={{ height }}>
        <h2>服务经理主职位管理</h2>
        <div className={styles.infoFormDiv}>
          <InfoForm label="服务经理" style={{ width: 'auto' }}>
            <DropDownSelect
              placeholder="工号/姓名"
              showObjKey="name"
              objId="login"
              value={''}
              searchList={employeeList}
              emitSelectItem={this.selectHandle}
              emitToSearch={this.searchHandle}
              boxStyle={dropDownSelectBoxStyle}
              ref={selectEmployee => this.selectEmployee = selectEmployee}
            />
          </InfoForm>
        </div>
        <div className={styles.tableDiv}>
          <CommonTable
            data={positionList}
            titleList={titleList}
            operation={operation}
          />
        </div>
        <div className={styles.btnDiv}>
          <Button
            type="primary"
            onClick={this.onSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
