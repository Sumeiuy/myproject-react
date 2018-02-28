/**
 * @Author: hongguangqing
 * @Description: 服务经理主职位设置新建页面
 * @Date: 2018-02-28 14:44:53
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-02-28 16:25:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import BottonGroup from '../permission/BottonGroup';
import TableDialog from '../common/biz/TableDialog';
import CommonTable from '../../components/common/biz/CommonTable';
import { emp } from '../../helper';
import { seibelConfig } from '../../config';
import commonConfirm from '../common/Confirm';
import styles from './createMainPostion.less';

// 表头
const { mainPosition: { titleList, approvalColumns } } = seibelConfig;
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};

export default class CreateFilialeCustTransfer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 搜索员工
    searchEmployee: PropTypes.func.isRequired,
    employeeList: PropTypes.array.isRequired,
    // 搜索员工对应的职位
    searchPosition: PropTypes.func.isRequired,
    positionList: PropTypes.array.isRequired,
    // 清除 员工列表、员工职位列表
    clearProps: PropTypes.func.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 提交成功后拉取左侧列表和详情方法
    queryAppList: PropTypes.func.isRequired,
    // 新建（修改）接口
    updateApplication: PropTypes.func.isRequired,
    // 新建（修改）接口返回的业务主键的值
    itemId: PropTypes.string.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 关闭弹框方法
    onEmitClearModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 审批人弹窗
      nextApproverModal: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 客户选中的职位
      checkedRadio: -1,
      // 默认选中的职位
      defaultChecked: -1,
      // 选中的职位的信息
      checkedEmployee: {},
      // 选择的服务经理
      employeeId: '',
      // 若disabled为true则说明用户没有选择新的主职位此时不给提交
      disabled: true,
    };
  }


  componentWillMount() {
    // 获取下一步骤按钮列表
    this.props.getButtonList({});
  }

  // 提交成功后清空数据
  @autobind
  emptyData() {
    const { clearProps } = this.props;
    this.setState({
      nextApproverModal: false,
    }, () => {
      clearProps();
    });
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal('isShowCreateModal');
  }

  @autobind
  closeModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    this.setState({ isShowModal: false }, () => {
      this.emptyData();
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

  // 选择某个职位
  @autobind
  checkTableData(record, index) {
    const { defaultChecked } = this.state;
    const disabled = defaultChecked === index;
    console.warn('recode', record);
    console.warn('index', index);
    this.setState({
      checkedRadio: index,
      checkedEmployee: record,
      disabled,
    });
  }

  // 提交
  @autobind
  handleSubmit(item) {
    const { employeeId, disabled } = this.state;
    if (_.isEmpty(employeeId)) {
      message.error('请选择服务经理');
      return;
    }
    if (disabled) {
      message.error('请设置新的服务经理主职位');
      return;
    }
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: item.flowAuditors[0].login,
      nextApproverList: item.flowAuditors,
      approverIdea: item.btnName,
      nextApproverModal: true,
    });
  }

  // 发送单客户修改请求,先走修改接口，再走走流程接口
  @autobind
  sendModifyRequest(value) {
    const { updateApplication } = this.props;
    const { checkedEmployee, employeeId } = this.state;
    updateApplication({
      targetEmpId: employeeId,
      postnId: checkedEmployee.positionId,
    }).then(() => {
      this.sendDoApproveRequest(value);
    });
  }

  // 发送请求，先走新建（修改）接口，再走走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const {
      doApprove,
      itemId,
      queryAppList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const { groupName, auditors, operate, approverIdea } = this.state;
    doApprove({
      itemId,
      // 下一组ID
      groupName,
      auditors: !_.isEmpty(value) ? value.login : auditors,
      operate,
      approverIdea,
    }).then(() => {
      message.success('服务经理主职位设置成功');
      this.setState({
        nextApproverModal: false,
        isShowModal: false,
      }, () => {
        queryAppList(query, pageNum, pageSize);
      });
    });
  }

  render() {
    const {
      checkedRadio,
      nextApproverModal,
      nextApproverList,
      isShowModal,
    } = this.state;
    const {
      employeeList,
      positionList,
      buttonList,
    } = this.props;
    const operation = {
      column: {
        key: 'radio',
        title: '设为主要',
        align: 'right',
        radio: checkedRadio,
      },
      operate: this.checkTableData,
    };
    const selfBtnGroup = (<BottonGroup
      list={buttonList}
      onEmitEvent={this.handleSubmit}
    />);
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.sendModifyRequest,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <CommonModal
        title="服务经理主职位设置"
        visible={isShowModal}
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
        selfBtnGroup={selfBtnGroup}
      >
        <div className={styles.mainPositionWrapper} >
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
          <TableDialog {...searchProps} />
        </div>
      </CommonModal>
    );
  }
}
