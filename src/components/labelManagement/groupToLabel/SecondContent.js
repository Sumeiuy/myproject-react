/* 分组转标签第二步
 * @Author: WangJunJun
 * @Date: 2018-08-06 17:42:24
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-09 17:13:20
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
      inputLabelName: '',
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
    if (_.isEmpty(value)) {
      this.props.clearPossibleLabels();
      return;
    }
    this.props.queryPossibleLabels({
      currentPage: 1,
      pageSize: 10,
      labelNameLike: value,
    }).then(() => {
      const { onClickLabelOption, findLabel, form } = this.props;
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
    const { isDisabledLabelDescInput } = this.state;
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
                  placeholder="请选择"
                  optionLabelProp="value"
                  defaultActiveFirstOption={false}
                />)
              }
            </FormItem>
          </div>
        </div>
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
