/*
* @Description: 新建合约条款 弹层
* @Author: XuWenKang
* @Date:   2017-09-27 17:10:08
* @Last Modified by: LiuJianShu
* @Last Modified time: 2017-10-20 18:36:27
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, message } from 'antd';
import _ from 'lodash';
import CommonModal from '../../components/common/biz/CommonModal';
import Select from '../../components/common/Select';
import DropDownSelect from '../common/dropdownSelect';
import styles from './addClause.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
export default class EditForm extends PureComponent {
  static propTypes = {
    // 点击确认的回调
    onConfirm: PropTypes.func.isRequired,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 部门列表
    departmentList: PropTypes.array.isRequired,
    // 是否显示弹框
    isShow: PropTypes.bool.isRequired,
    // 关闭弹框的回调
    onCloseModal: PropTypes.func.isRequired,
    // 根据关键词搜索部门
    searchDepartment: PropTypes.func.isRequired,
    // 默认数据
    defaultData: PropTypes.object,
    // 是否是编辑
    edit: PropTypes.bool,
  }

  static defaultProps = {
    defaultData: EMPTY_OBJECT,
    edit: false,
  }

  constructor(props) {
    super(props);
    const { defaultData, defaultData: { data, index }, edit } = props;
    let clauseName = EMPTY_OBJECT;
    let detailParam = EMPTY_OBJECT;
    let department = EMPTY_OBJECT;
    let value = '';
    let editIndex = '';
    if (!_.isEmpty(defaultData)) {
      clauseName = {
        termVal: data.termsDisplayName,
        value: data.termsName,
      };
      detailParam = {
        val: data.paraDisplayName,
        value: data.paraName,
      };
      value = data.paraVal;
      department = {
        name: data.divName,
        value: data.divIntegrationId,
      };
      editIndex = index;
    }
    this.state = {
      clauseName,
      detailParam,
      value,
      department,
      detailParamList: EMPTY_ARRAY, // 明细参数列表
      editIndex,
      edit,
    };
  }

  @autobind
  onOk() {
    const {
      clauseName,
      detailParam,
      value,
      department,
      edit,
      editIndex,
    } = this.state;
    if (!clauseName.value) {
      message.error('请选择条款名称');
      return;
    }
    if (!detailParam.value) {
      message.error('请选择明细参数');
      return;
    }
    if (!value) {
      message.error('请输入值');
      return;
    }
    if (!department.value) {
      message.error('请选择合作部门');
      return;
    }
    const termItem = {
      // 条款名称
      termsDisplayName: clauseName.termVal,
      // 条款 ID
      termsName: clauseName.value,
      // 明细参数名称
      paraDisplayName: detailParam.val,
      // 明细参数 ID
      paraName: detailParam.value,
      // 值
      paraVal: value,
      // 合作部门名称
      divName: department.name,
      // 合作部门 ID
      divIntegrationId: department.value,
    };
    const termData = {
      edit,
      editIndex,
      termItem,
    };
    this.props.onConfirm(termData);
    this.resetData();
  }

  @autobind
  closeModal() {
    this.props.onCloseModal();
    this.resetData();
  }

  // Select Change方法
  @autobind
  handleSelectChange(key, value) {
    if (key === 'clauseName') {
      const { clauseNameList } = this.props;
      const clauseName = _.filter(clauseNameList, v => v.value === value)[0];
      const detailParamList = clauseName.param;
      this.setState({
        ...this.state,
        clauseName,
        detailParamList,
        detailParam: EMPTY_OBJECT,
      });
    } else if (key === 'detailParam') {
      const { detailParamList } = this.state;
      const detailParam = _.filter(detailParamList, v => v.value === value)[0];
      this.setState({
        ...this.state,
        detailParam,
      });
    }
  }

  // 选择部门
  @autobind
  handleSelectDepartment(v) {
    this.setState({
      ...this.state,
      department: v,
    });
  }

  // 筛选部门
  @autobind
  handleSearchDepartment(v) {
    this.props.searchDepartment(v);
  }

  // 修改值
  @autobind
  changeValue(e) {
    this.setState({
      ...this.state,
      value: e.target.value,
    });
  }

  // 重置数据
  @autobind
  resetData() {
    this.setState({
      clauseName: EMPTY_OBJECT,
      detailParam: EMPTY_OBJECT,
      value: '',
      department: EMPTY_OBJECT,
      detailParamList: EMPTY_ARRAY,
    }, () => {
      if (this.selectDivComponent) {
        this.selectDivComponent.clearValue();
      }
    });
  }

  render() {
    const clasueProps = {
      modalKey: 'editFormModal',
      title: '新建合约条款',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: this.props.isShow,
      size: 'normal',
      zIndex: 1001,
      wrapClassName: 'addClauseWrap',
    };
    const { clauseNameList, departmentList } = this.props;
    const {
      clauseName,
      detailParamList,
      detailParam,
      value,
      department,
    } = this.state;
    return (
      <div className={styles.addClauseBox}>
        <CommonModal {...clasueProps} >
          <div className={styles.lineInputWrap}>
            <div className={styles.label}>
              <i className={styles.required} />
                  条款名称<span className={styles.colon}>:</span>
            </div>
            <div className={`${styles.componentBox} ${styles.selectBox}`}>
              <Select
                name="clauseName"
                data={clauseNameList}
                value={clauseName.value || ''}
                onChange={this.handleSelectChange}
              />
            </div>
          </div>
          <div className={styles.lineInputWrap}>
            <div className={styles.label}>
              <i className={styles.required} />
                  明细参数<span className={styles.colon}>:</span>
            </div>
            <div className={`${styles.componentBox} ${styles.selectBox}`}>
              <Select
                name="detailParam"
                data={detailParamList}
                value={detailParam.val || ''}
                onChange={this.handleSelectChange}
              />
            </div>
          </div>
          <div className={styles.lineInputWrap}>
            <div className={styles.label}>
              <i className={styles.required} />
                  值<span className={styles.colon}>:</span>
            </div>
            <div className={`${styles.componentBox} ${styles.inputBox}`}>
              <Input
                onChange={this.changeValue}
                value={value}
              />
            </div>
          </div>
          <div className={styles.lineInputWrap}>
            <div className={styles.label}>
              <i className={styles.required} />
                  合作部门<span className={styles.colon}>:</span>
            </div>
            <div className={styles.componentBox}>
              <DropDownSelect
                placeholder="合作部门"
                showObjKey="name"
                objId="value"
                value={department.name || ''}
                searchList={departmentList}
                emitSelectItem={this.handleSelectDepartment}
                emitToSearch={this.handleSearchDepartment}
                boxStyle={dropDownSelectBoxStyle}
                ref={selectDivComponent => this.selectDivComponent = selectDivComponent}
              />
            </div>
          </div>
        </CommonModal>
      </div>
    );
  }
}
