/*
* @Author: XuWenKang
* @Date:   2017-09-27 17:10:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 19:00:15
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import CommonModal from '../../components/common/biz/CommonModal';
import Select from '../../components/common/Select';
import DropDownSelect from '../common/dropdownSelect';

import styles from './addClause.less';

const EMPTY_ARRAY = [];
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
export default class EditForm extends PureComponent {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    clauseList: PropTypes.array.isRequired,
    detailParamList: PropTypes.array.isRequired,
    departmentList: PropTypes.array.isRequired,
    isShow: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      clauseData: {
        clauseName: '',
        detailParam: '',
        value: '',
        department: '',
      },
    };
  }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  @autobind
  closeModal() {
    this.props.onCloseModal();
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    console.log({ [key]: value });
    this.setState({
      ...this.state,
      [key]: value,
    });
  }

  // 选择部门
  handleSelectDepartment(v) {
    console.log(v);
  }

  // 筛选部门
  handleSearchDepartment(v) {
    console.log(v);
  }

  // 修改值
  changeValue(e) {
    console.log(e.target.value);
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
      wrapClassName: styles.addClauseBox,
    };
    console.log('asdasd', this.props.isShow);
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
                name="childType"
                data={EMPTY_ARRAY}
                value={this.state.clauseName}
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
                name="childType"
                data={EMPTY_ARRAY}
                value={this.state.detailParam}
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
