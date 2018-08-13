/* 分组转标签第二步
 * @Author: WangJunJun
 * @Date: 2018-08-06 17:42:24
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-13 14:23:41
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input, Form, AutoComplete } from 'antd';

import Table from '../../common/commonTable';
import { LABEL_NAME_REG, groupCustColumns } from '../config';

import tableStyles from '../../common/commonTable/index.less';
import styles from './secondContent.less';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

const autoCompleteStyle = { width: 200 };
// 文本输入框由行数控制高度
const textAreaRows = {
  minRows: 4,
  maxRows: 4,
};

@Form.create()
export default class SecondContent extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    currentSelectGroup: PropTypes.object.isRequired,
    queryGroupCustList: PropTypes.func.isRequired,
    groupCustInfo: PropTypes.object.isRequired,
    queryPossibleLabels: PropTypes.func.isRequired,
    possibleLabelListInfo: PropTypes.object.isRequired,
    clearPossibleLabels: PropTypes.func.isRequired,
    onClickLabelOption: PropTypes.func.isRequired,
    clickedLabelOption: PropTypes.object.isRequired,
    findLabel: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 标签名称是否存在的提示语
      labelNameTip: '',
      currentLabel: {},
      // 是否置灰标签描述输入框
      isDisabledLabelDescInput: false,
    };
  }

  // 将列表数据项加一个id字段
  @autobind
  generateListData() {
    const {
      groupCustInfo: {
        groupCustDTOList,
      },
    } = this.props;
    return _.map(groupCustDTOList, item => ({ ...item, id: item.brokerNumber }));
  }

  handleLabelOptionClick(item) {
    const { onClickLabelOption, form } = this.props;
    onClickLabelOption(item);
    form.setFieldsValue({ labelDesc: item.labelDesc });
    this.setState({
      isDisabledLabelDescInput: _.has(item, 'id'),
    });
  }

  // 翻页
  @autobind
  handlePageChange(pageNum, pageSize) {
    const { currentSelectGroup } = this.props;
    this.props.queryGroupCustList({
      groupId: currentSelectGroup.groupId,
      pageNum,
      pageSize,
    });
  }

  // 通过关键词联想标签数据
  @autobind
  handleAssociateData(value) {
    const {
      queryPossibleLabels, onClickLabelOption,
      findLabel, form, clearPossibleLabels,
    } = this.props;
    if (_.isEmpty(value)) {
      clearPossibleLabels();
      form.setFieldsValue({ labelDesc: '' });
      this.setState({
        isDisabledLabelDescInput: false,
      });
      return;
    }
    queryPossibleLabels({
      currentPage: 1,
      pageSize: 10,
      labelNameLike: value,
    }).then(() => {
      // 输入框值变化需要清空上次点击标签自动补全组件option对应的标签数据
      onClickLabelOption({});
      // 清空描述
      const currentLabel = findLabel(value);
      form.setFieldsValue({ labelDesc: currentLabel.labelDesc });
      this.setState({
        isDisabledLabelDescInput: _.has(currentLabel, 'id'),
      });
    });
  }

  @autobind
  handleChange(value) {
    this.setState({
      currentLabel: this.props.findLabel(value),
      labelNameTip: '',
    });
  }

  // 标签名称输入框失焦
  @autobind
  handleBlur() {
    const { findLabel, form } = this.props;
    let tip;
    form.validateFields(['labelName'], (error, values) => {
      // 验证未通过或标签输入框为空
      if (error || !values.labelName) {
        tip = '';
      } else {
        // currentLabel有id时，标签输入的标签为已有标签
        const currentLabel = findLabel(values.labelName);
        tip = _.has(currentLabel, 'id')
          ? <p className={styles.labelNameTip}>此标签为系统已有标签，选择后将为分组中客户设置上此标签</p>
          : <p className={styles.labelNameTip}>此标签在系统中不存在，将为您新建此标签，请在下方输入此标签的详细说明</p>;
      }
    });
    this.setState({
      labelNameTip: tip,
    });
  }

  // 生成联想词数据项
  @autobind
  renderOptions() {
    const {
      possibleLabelListInfo: {
        labelList,
      },
    } = this.props;
    const { currentLabel: { labelName = '' } } = this.state;
    return _.map(labelList, (item) => {
      const htmlStr = (item.labelName || '').replace(
        labelName,
        `<em class=${styles.signRed}>${labelName}</em>`,
      );
      return (
        <Option key={item.id} value={item.labelName}>
          <p onClick={() => { this.handleLabelOptionClick(item); }}>
            <span dangerouslySetInnerHTML={{ __html: htmlStr }} />
            <span>{`(${item.labelTypeName})`}</span>
          </p>
        </Option>
      );
    });
  }

  render() {
    const {
      currentSelectGroup: {
        groupName,
      },
      form: { getFieldDecorator },
      groupCustInfo: {
        curPageNum,
        pageSize,
        totalRecordNum,
      },
    } = this.props;
    const listData = this.generateListData();
    const autoCompleteDataSource = this.renderOptions() || [];
    const { isDisabledLabelDescInput, labelNameTip } = this.state;
    return (
      <div className={styles.modalContent}>
        <div className={styles.row}>
          <span className={styles.label}>已选择分组:</span>
          <div className={styles.content}>{groupName}</div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}><b>*</b>新标签名称:</span>
          <div className={styles.content}>
            <FormItem>
              {
                getFieldDecorator('labelName', {
                  rules: [{
                    required: true, message: '请输入标签名称',
                  }, {
                    max: 8, message: '最多为8个字',
                  }, {
                    min: 4, message: '最少为4个字',
                  }, {
                    pattern: LABEL_NAME_REG, message: '可输入字符仅为汉字、数字、字母及合法字符(#&-_@%)',
                  }],
                  validateTrigger: 'onBlur',
                })(<AutoComplete
                  style={autoCompleteStyle}
                  dataSource={autoCompleteDataSource}
                  onSearch={this.handleAssociateData}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  placeholder="标签名称"
                  optionLabelProp="value"
                  defaultActiveFirstOption={false}
                />)
              }
            </FormItem>
          </div>
        </div>
        {labelNameTip}
        <div className={styles.row}>
          <span className={styles.label}><b>*</b>标签描述:</span>
          <div className={styles.content}>
            <FormItem>
              {
                getFieldDecorator('labelDesc', {
                  rules: [{
                    required: true, message: '请输入标签描述',
                  }, {
                    min: 10, message: '最少为10个字',
                  }, {
                    max: 500, message: '最多为500个字',
                  }],
                })(<Input.TextArea
                  autosize={textAreaRows}
                  disabled={isDisabledLabelDescInput}
                />)
              }
            </FormItem>
          </div>
        </div>
        <p className={styles.tableTitle}>已选择客户列表</p>
        <Table
          pageData={{
            curPageNum,
            curPageSize: pageSize,
            totalRecordNum,
          }}
          listData={listData}
          onPageChange={this.handlePageChange}
          tableClass={`${tableStyles.groupTable} ${styles.groupCustListTable}`}
          titleColumn={groupCustColumns}
          scrollY={205}
          columnWidth={['25%', '25%', '25%', '25%']}
          emptyListDataNeedEmptyRow
        />
      </div>
    );
  }
}
