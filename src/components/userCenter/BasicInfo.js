/**
 * @Descripter: 用户基本信息
 * @Author: K0170179
 * @Date: 2018/4/11
 */

import React, { PureComponent } from 'react';
import { Card, List, Divider, Tag, Form, Input, Button, Popover, Checkbox, Modal } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import defaultHeader from './img/defaultHeader.jpg';
import styles from './basicInfo.less';

const { Meta } = Card;
const { TextArea } = Input;
const FormItem = Form.Item;
const Search = Input.Search;
const warning = Modal.warning;

// 获取个人标签和个人介绍的Mapping（label和字段）标识
const ADVISER_INFO = 'ADVISER_INFO';
// 审批中的状态标识
const APPROVING = 'approving';

@Form.create()
export default class BasicInfo extends PureComponent {
  static propTypes = {
    userBaseInfo: PropTypes.object.isRequired,
    editorState: PropTypes.bool.isRequired,
    allLabels: PropTypes.array.isRequired,
    LabelAndDescApprover: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    changeEditorState: PropTypes.func.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    queryEmpLabelAndDescApprover: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      newLabel: [],
      // 选择审批人弹窗状态
      approverModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { userBaseInfo } = this.props;
    const { userBaseInfo: newUserBaseInfo } = nextProps;
    if (userBaseInfo !== newUserBaseInfo) {
      const {
        applyingDescription,
        label,
      } = newUserBaseInfo;
      this.setState({
        newApplyingDescription: applyingDescription,
        newLabel: label || [],
      });
    }
  }

  getBaseInfoMapping(type) {
    switch (type) {
      case ADVISER_INFO:
        return [
          {
            name: '个人介绍',
            key: 'applyingDescription',
          },
          {
            name: '个人标签',
            key: 'label',
          },
        ];
      default:
        return [
          {
            name: '工号',
            key: 'empId',
          },
          {
            name: '年龄',
            key: 'age',
          },
          {
            name: '联系电话',
            key: 'phoneNum',
          },
          {
            name: '执业证书编号',
            key: 'occupationCertificateNo',
          },
        ];
    }
  }

  // 头像
  headerImg(headerImgUrl = defaultHeader) {
    return (
      <div className={styles.userImg}>
        <img src={headerImgUrl} alt="默认头像" />
      </div>
    );
  }

  // 选择标签事件
  @autobind
  handleLabelCheckBox(e, labelItem) {
    if (e.target.checked) {
      const { newLabel } = this.state;
      if (newLabel.length >= 4) {
        warning({
          title: '标签可选数目不超过4条',
        });
        return;
      }
      this.setState((preState) => {
        const nextNewLabel = _.concat(preState.newLabel, labelItem);
        return { newLabel: nextNewLabel };
      });
    } else {
      this.setState((preState) => {
        const nextNewLabel = _.filter(preState.newLabel,
            removeItem => removeItem.id !== labelItem.id);
        return { newLabel: nextNewLabel };
      });
    }
  }

  // 选择标签component
  selectLabelContent() {
    const {
      allLabels = [],
    } = this.props;
    const { newLabel } = this.state;
    const labelsId = newLabel.map(item => item.id);
    return (
      <div className={styles.labelContent}>
        {
          <List
            size="small"
            dataSource={allLabels}
            renderItem={item => (
              <List.Item>
                <Checkbox
                  checked={labelsId.includes(item.id)}
                  onChange={(e) => {
                    this.handleLabelCheckBox(e, item);
                  }}
                >
                  {item.name}
                </Checkbox>
              </List.Item>
            )}
          />
        }
      </div>
    );
  }

  // 删除标签
  @autobind
  deleteUserLabel(e, labelId) {
    e.preventDefault();
    this.setState((preState) => {
      const { newLabel: preLabel } = preState;
      const newLabel = _.filter(preLabel, preLabelItem => preLabelItem.id !== labelId);
      return { newLabel };
    });
  }

  // 点击更多加载标签并展示
  @autobind
  moreLabel() {
    const {
      queryAllLabels,
      allLabels,
    } = this.props;
    if (!allLabels.length) {
      queryAllLabels();
    }
  }

  // 打开审批人选择审批人model
  @autobind
  openApproverBoard() {
    const { queryEmpLabelAndDescApprover, LabelAndDescApprover } = this.props;
    if (!LabelAndDescApprover.length) {
      queryEmpLabelAndDescApprover();
    }
    this.setState({
      approverModal: true,
    });
  }
  // 关闭审批人选择审批人model
  @autobind
  closeApproverBoard() {
    this.setState({
      approverModal: false,
    });
  }

  // 取消编辑状态
  @autobind
  cancelEditor() {
    const { changeEditorState } = this.props;
    changeEditorState();
  }
  render() {
    const {
      userBaseInfo,
      editorState,
      LabelAndDescApprover,
      form: {
        getFieldDecorator,
      },
    } = this.props;
    const { newLabel, approverModal } = this.state;
    // 当前
    const isApproving = APPROVING === userBaseInfo.flowState;

    return (
      <div className={styles.basicInfo}>
        <div className={styles.userInfo}>
          <div className={styles.headerImg}>
            <Card
              hoverable
              style={{ width: 140 }}
              cover={this.headerImg(userBaseInfo.photograph)}
            >
              <Meta
                className={styles.desc}
                description={userBaseInfo.name}
              />
            </Card>
          </div>
          <div className={styles.userInfoDesc}>
            <List
              dataSource={this.getBaseInfoMapping()}
              renderItem={
                item => (
                  <List.Item>
                    <b>{item.name}:</b>
                    {userBaseInfo[item.key] || '--'}
                  </List.Item>
                )
              }
            />
          </div>
        </div>
        <Divider />
        <Form layout="inline">
          <div className={styles.personalDesc}>
            <List
              dataSource={this.getBaseInfoMapping(ADVISER_INFO)}
              renderItem={
                (item, index) => (
                    // 个人介绍
                    (<List.Item>
                      <div className={styles.label}>
                        <div>{item.name}:</div>
                        {
                          isApproving ?
                            <div>(审批中)</div> :
                            null
                        }
                      </div>
                      {
                        index === 0 ?
                          // 个人介绍
                          <div className={styles.inputWrap}>
                            {
                              editorState ?
                                getFieldDecorator('applyingDescription', {
                                  rules: [{ max: 200, message: '个人介绍最多200个汉字' }],
                                  initialValue: userBaseInfo[item.key] || '--',
                                })(
                                  <TextArea
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                  />) :
                                userBaseInfo[item.key] || '--'
                            }
                          </div> :
                          // 个人标签
                          <div className={styles.inputWrap}>
                            {editorState ?
                              newLabel
                                .map(label =>
                                  <Tag
                                    closable
                                    onClose={(e) => {
                                      this.deleteUserLabel(e, label.id);
                                    }}
                                    color="gold"
                                    key={label.id}
                                  >
                                    {label.name}
                                  </Tag>,
                                ) :
                              (userBaseInfo[item.key] || [])
                                  .map(label => <Tag color="gold" key={label.id}>{label.name}</Tag>)
                            }
                            {
                              !newLabel.length ?
                                '暂未设置标签' :
                                null
                            }
                          </div>
                      }
                    </List.Item>)
                )
              }
            />
            {
              editorState ?
                <div className={styles.selectLabel}>
                  <Popover
                    placement="rightTop"
                    content={this.selectLabelContent()}
                    trigger="click"
                    overlayClassName={styles.labelPopover}
                  >
                    <Button onClick={this.moreLabel} icon="plus">更多</Button>
                  </Popover>
                </div> :
                null
            }
            {
              editorState ?
                <div className={styles.selectApprover}>
                  <FormItem
                    label="选择审批人"
                  >
                    {getFieldDecorator('approver', {
                      rules: [{
                        required: true, message: '请选择审批人',
                      }],
                    })(
                      <Search
                        placeholder="搜索内容"
                        style={{ width: 200 }}
                        readOnly
                        onClick={this.openApproverBoard}
                      />,
                    )}
                  </FormItem>
                </div> :
                null
            }
          </div>
        </Form>
        {
          editorState ?
            <div className={styles.editorInfoSubmit}>
              <Button onClick={this.cancelEditor}>取消</Button>
              <Button type="primary">提交审批</Button>
            </div> :
            null
        }
        {
          <ChoiceApproverBoard
            visible={approverModal}
            approverList={LabelAndDescApprover}
            onClose={() => this.closeApproverBoard('approverModal')}
            // onOk={this.handleApproverModalOK}
          />
        }
      </div>
    );
  }
}
