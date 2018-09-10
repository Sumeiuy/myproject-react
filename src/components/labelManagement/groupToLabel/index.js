/*
 * @Author: WangJunJun
 * @Date: 2018-08-06 16:16:47
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-10 09:49:33
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { message, Modal, Button } from 'antd';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import _ from 'lodash';

import FirstContent from './FirstContent';
import SecondContent from './SecondContent';
import logable, { logCommon } from '../../../decorators/logable';

import styles from './index.less';


export default class GroupToLabel extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    toggleGroupToLabelModalVisible: PropTypes.func.isRequired,
    queryCustGroupList: PropTypes.func.isRequired,
    custGroupListInfo: PropTypes.object.isRequired,
    queryGroupCustList: PropTypes.func.isRequired,
    groupCustInfo: PropTypes.object.isRequired,
    queryPossibleLabels: PropTypes.func.isRequired,
    possibleLabelListInfo: PropTypes.object.isRequired,
    clearPossibleLabels: PropTypes.func.isRequired,
    group2Label: PropTypes.func.isRequired,
    onComparedGetLabelList: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      // 当前选中的分组数据
      currentSelectGroup: {},
      // 点击标签自动补全组件中option的标签
      clickedLabelOption: {},
    };
  }

  componentDidMount() {
    // 首次查询客户分组列表数据
    this.props.queryCustGroupList({
      pageNum: 1,
      pageSize: 10,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      currentSelectGroup,
    } = this.state;
    if (prevState.currentSelectGroup !== currentSelectGroup) {
      // 选中的分组改变时重新查询分组对应的客户列表数据
      this.props.queryGroupCustList({
        groupId: currentSelectGroup.groupId,
        pageSize: 5,
        pageNum: 1,
      });
    }
  }

  // 通过输入标签名称去联想词中匹配对应的标签信息，匹配到了名称和输入的值相等时，则返回对应的标签信息，否则返回输入的标签名称
  @autobind
  findLabel(labelName) {
    const {
      possibleLabelListInfo: {
        labelList,
      },
    } = this.props;
    const { clickedLabelOption } = this.state;
    // 点击了标签的自动补全option
    if (!_.isEmpty(clickedLabelOption)) {
      return clickedLabelOption;
    }
    // 存放通过输入框中值与联想出来的的标签比较相等的标签列表
    const list = _.filter(labelList, item => item.labelName === labelName);
    if (list.length === 1) {
      return list[0];
    }
    // 当发现有多个名称相同的标签时，认为输入的标签为我的标签类型
    if (list.length > 1) {
      return _.find(list, item => item.labelTypeId === '0') || {};
    }
    return { labelName };
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '下一步' } })
  handleNextStep() {
    this.setState(state => ({
      step: state.step + 1,
    }));
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '上一步' } })
  handlePrevStep() {
    this.setState(state => ({
      step: state.step - 1,
    }));
  }

  // 当前选中的分组数据信息
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '分组转标签选择分组',
      value: '$args[0][groupName]',
    },
  })
  handleSelectGroup(record) {
    this.setState({
      currentSelectGroup: record,
    });
  }

  @autobind
  handleSubmit() {
    const form = this.secondRef.getForm();
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { currentSelectGroup: { groupId = '' } } = this.state;
      const { group2Label, onComparedGetLabelList, toggleGroupToLabelModalVisible } = this.props;
      const { labelName, id } = this.findLabel(values.labelName);
      const payload = {
        groupId,
        labelId: id,
        labelName,
        labelDesc: values.labelDesc,
      };
      group2Label(payload).then(({ resultData }) => {
        if (resultData === 'success') {
          message.success('分组转标签成功');
          onComparedGetLabelList();
          // 关闭模态框
          toggleGroupToLabelModalVisible(false);
        }
      });
      logCommon({
        type: 'Submit',
        payload: {
          type: '分组转标签',
          value: JSON.stringify(payload),
        },
      });
    });
  }

  // 根据当前的步骤选择渲染弹窗内容
  @autobind
  switchStep() {
    const { step, currentSelectGroup, clickedLabelOption } = this.state;
    const {
      queryCustGroupList,
      custGroupListInfo,
      queryGroupCustList,
      groupCustInfo,
      queryPossibleLabels,
      possibleLabelListInfo,
      clearPossibleLabels,
    } = this.props;
    let node = (<FirstContent
      queryCustGroupList={queryCustGroupList}
      custGroupListInfo={custGroupListInfo}
      handleSelectGroup={this.handleSelectGroup}
      currentSelectRow={currentSelectGroup}
    />);
    if (step === 2) {
      node = (<SecondContent
        ref={this.saveRef}
        currentSelectGroup={currentSelectGroup}
        queryGroupCustList={queryGroupCustList}
        groupCustInfo={groupCustInfo}
        queryPossibleLabels={queryPossibleLabels}
        possibleLabelListInfo={possibleLabelListInfo}
        clearPossibleLabels={clearPossibleLabels}
        onClickLabelOption={this.handleClickLabelOption}
        clickedLabelOption={clickedLabelOption}
        findLabel={this.findLabel}
      />);
    }
    return node;
  }

  // 标签的自动补全组件option点击回调方法
  @autobind
  handleClickLabelOption(record) {
    this.setState({
      clickedLabelOption: record,
    });
  }

  // 保存步骤中第二步组件的ref
  @autobind
  saveRef(ref) {
    if (ref) {
      this.secondRef = ref;
    }
  }

  // 模态框的底部
  @autobind
  renderModalFooter() {
    const { toggleGroupToLabelModalVisible } = this.props;
    const { step, currentSelectGroup } = this.state;
    // 当前没有选中分组下一步按钮不可用
    const isNotNext = _.isEmpty(currentSelectGroup);
    let node = (
      <div className={styles.operationBtnSection}>
        <Button
          className={styles.btn}
          onClick={() => toggleGroupToLabelModalVisible(false)}
        >
          取消
        </Button>
        <Button
          type="primary"
          className={cx(styles.btn, {
            [styles.blueGroundBtn]: !isNotNext,
          })}
          disabled={isNotNext}
          onClick={this.handleNextStep}
        >
          下一步
        </Button>
      </div>
    );
    if (step === 2) {
      node = (
        <div className={styles.operationBtnSection}>
          <Button
            className={styles.btn}
            onClick={this.handlePrevStep}
          >
            上一步
          </Button>
          <Button
            htmlType="submit"
            className={`${styles.blueGroundBtn} ${styles.btn}`}
            type="primary"
            // 加入节流函数
            onClick={_.debounce(this.handleSubmit, 250)}
          >
            提交
          </Button>
        </div>
      );
    }
    return node;
  }

  render() {
    const { visible } = this.props;
    if (!visible) {
      return null;
    }
    const { toggleGroupToLabelModalVisible } = this.props;
    return (
      <Modal
        visible={visible}
        className={styles.groupToLabelModal}
        width={650}
        title="分组转标签"
        closable
        maskClosable={false}
        onCancel={() => toggleGroupToLabelModalVisible(false)}
        footer={this.renderModalFooter()}
      >
        {this.switchStep()}
      </Modal>
    );
  }
}
