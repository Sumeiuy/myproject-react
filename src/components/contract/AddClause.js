/*
* @Description: 新建合约条款 弹层
* @Author: XuWenKang
* @Date:   2017-09-27 17:10:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-10-09 17:22:39
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
let timer;
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
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      clauseName: EMPTY_OBJECT,
      detailParam: EMPTY_OBJECT,
      value: '',
      department: '',
      detailParamList: EMPTY_ARRAY, // 明细参数列表
    };
  }

  componentDidMount() {
    timer = setInterval(() => {
      const wrap = document.querySelector('.addClauseWrap');
      if (wrap) {
        wrap.previousElementSibling.style.backgroundColor = 'rgba(0,0,0,0)';
      }
    }, 50);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  @autobind
  onOk() {
    const {
      clauseName,
      detailParam,
      value,
      department,
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
    if (!department) {
      message.error('请选择合作部门');
      return;
    }
    this.props.onConfirm({
      termsName: clauseName,
      paraName: detailParam,
      paraVal: value,
      divName: department,
    });
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
    console.log({ [key]: value });
    if (key === 'clauseName') {
      const { clauseNameList } = this.props;
      const clauseName = _.filter(clauseNameList, v => v.value === value)[0];
      const detailParamList = clauseName.valueList;
      this.setState({
        ...this.state,
        clauseName,
        detailParamList,
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
    console.log(v);
  }

  // 筛选部门
  @autobind
  handleSearchDepartment(v) {
    console.log(v);
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
      department: '',
      detailParamList: EMPTY_ARRAY,
    });
  }

  render() {
    const clasueProps = {
      modalKey: 'editFormModal',
      title: '新建合约条款',
      onOk: this.onOk,
      closeModal: this.closeModal,
      visible: this.props.isShow,
      size: 'small',
      zIndex: 1001,
      wrapClassName: 'addClauseWrap',
    };
    const { clauseNameList } = this.props;
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
                value={this.state.clauseName.value || ''}
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
                data={this.state.detailParamList}
                value={this.state.detailParam.value || ''}
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
                value={this.state.department}
                searchList={EMPTY_ARRAY}
                emitSelectItem={this.handleSelectDepartment}
                emitToSearch={this.handleSearchDepartment}
                boxStyle={dropDownSelectBoxStyle}
              />
            </div>
          </div>
        </CommonModal>
      </div>
    );
  }
}
