/*
 * @Description: 主职位界面
 * @Author: LiuJianShu
 * @Date: 2017-12-21 15:01:59
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-02 11:00:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import _ from 'lodash';
import { message, Modal } from 'antd';

import withRouter from '../../decorators/withRouter';
import Button from '../../components/common/Button';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import { closeRctTabById } from '../../utils/fspGlobal';
import { env, emp, dom } from '../../helper';
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
  // 组织机构树
  custRangeList: state.customerPool.custRange,
});

const mapDispatchToProps = {
  // 搜索员工列表
  searchEmployee: fetchDataFunction(true, 'mainPosition/searchEmployee', true),
  // 搜索员工职位列表
  searchPosition: fetchDataFunction(true, 'mainPosition/searchPosition', true),
  // 设置主职位
  updatePosition: fetchDataFunction(true, 'mainPosition/updatePosition', true),
  // 清除 员工列表、员工职位列表
  clearProps: fetchDataFunction(true, 'mainPosition/clearProps', true),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class MainPosition extends PureComponent {
  static propTypes = {
    searchEmployee: PropTypes.func.isRequired,
    searchPosition: PropTypes.func.isRequired,
    updatePosition: PropTypes.func.isRequired,
    clearProps: PropTypes.func.isRequired,
    employeeList: PropTypes.array.isRequired,
    positionList: PropTypes.array.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.checkUserIsFiliale();
    this.state = {
      checkedRadio: -1,
      defaultChecked: -1,
      checkedEmployee: {},
      employeeId: '',
      disabled: true,
    };
  }

  componentDidMount() {
    // 监听window.onResize事件
    this.registerWindowResize();
    this.setContentHeight();
  }

  componentWillReceiveProps({ custRangeList }) {
    const oldCustRangeList = this.props.custRangeList;
    if (!_.isEmpty(custRangeList) && oldCustRangeList !== custRangeList) {
      this.checkUserIsFiliale();
    }
  }

  componentWillUnmount() {
    this.cancelWindowResize();
    const { clearProps } = this.props;
    clearProps();
  }

  // Resize事件
  @autobind
  onResizeChange() {
    this.setContentHeight();
  }

  // 提交按钮
  @autobind
  onSubmit() {
    const { checkedEmployee, employeeId } = this.state;
    const { updatePosition, clearProps } = this.props;
    if (!_.isEmpty(checkedEmployee)) {
      updatePosition({
        employeeId,
        positionId: checkedEmployee.positionId,
      }).then(() => {
        message.success('提交成功');
        clearProps();
      });
    }
  }

  @autobind
  setContentHeight() {
    // 次变量用来判断是否在FSP系统中
    let viewHeight = document.documentElement.clientHeight;
    if (env.isIE()) {
      viewHeight -= 10;
    }
    // 因为页面在开发过程中并不存在于FSP系统中，而在生产环境下是需要将本页面嵌入到FSP系统中
    // 需要给改容器设置高度，以防止页面出现滚动
    // FSP头部Tab的高度
    const fspTabHeight = 55;

    // 设置系统容器高度
    let pch = viewHeight;
    if (env.isInFsp()) {
      pch = viewHeight - fspTabHeight;
    }
    const pageContainer = document.querySelector(config.container);
    const pageContent = document.querySelector(config.content);
    const childDiv = pageContent.querySelector('div');
    dom.setStyle(pageContainer, 'height', `${pch}px`);
    dom.setStyle(pageContent, 'height', '100%');
    dom.setStyle(childDiv, 'height', '100%');
  }


  // 注册window的resize事件
  @autobind
  registerWindowResize() {
    window.addEventListener('resize', this.onResizeChange, false);
  }

  // 注销window的resize事件
  @autobind
  cancelWindowResize() {
    window.removeEventListener('resize', this.onResizeChange, false);
    const pageContainer = document.querySelector(config.container);
    const pageContent = document.querySelector(config.content);
    const childDiv = pageContent.querySelector('div');
    dom.setStyle(pageContainer, 'height', 'auto');
    dom.setStyle(pageContent, 'height', 'auto');
    dom.setStyle(childDiv, 'height', 'auto');
  }
  // 判断当前登录用户部门是否是分公司
  @autobind
  checkUserIsFiliale() {
    const { custRangeList } = this.props;
    const that = this;
    if (!_.isEmpty(custRangeList)) {
      if (!emp.isFiliale(custRangeList, emp.getOrgId())) {
        Modal.warning({
          title: '提示',
          content: '您不是分公司人员，无权操作！',
          onOk() {
            that.handleCancel();
          },
        });
      }
    }
  }

  // 关闭 FSP tab 页
  @autobind
  handleCancel() {
    if (env.isInFsp) {
      closeRctTabById('FSP_MAIN_POSTN_MANAGE');
    }
  }

  // 选择某个职位
  @autobind
  checkTableData(record, index) {
    const { defaultChecked } = this.state;
    const disabled = defaultChecked === index;
    this.setState({
      checkedRadio: index,
      checkedEmployee: record,
      disabled,
    });
  }

  // 点击具体的员工
  @autobind
  selectHandle(value) {
    const { searchPosition } = this.props;
    searchPosition({
      login: value.login,
      integrationId: emp.getOrgId(),
    }).then(() => {
      const { positionList } = this.props;
      const checkedRadio = _.findIndex(positionList, ['primary', true]);
      this.setState({
        checkedRadio,
        defaultChecked: checkedRadio,
        employeeId: value.login,
      });
    });
  }

  // 搜索员工
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
    const { checkedRadio, disabled } = this.state;
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
      <div className={styles.mainPositionWrapper}>
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
            disabled={disabled}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
