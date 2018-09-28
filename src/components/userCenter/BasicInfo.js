/**
 * @Descripter: 用户基本信息
 * @Author: K0170179
 * @Date: 2018/4/11
 */

import React, { PureComponent } from 'react';
import { Card, List, Divider, Tag, Form, Input, Button, Popover, Modal } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import Icon from '../common/Icon';
import defaultHeader from './img/defaultHeader.jpg';
import styles from './basicInfo.less';
import withRouter from '../../decorators/withRouter';
import logable, { logCommon, logPV } from '../../decorators/logable';

const { TextArea } = Input;
const FormItem = Form.Item;
const Search = Input.Search;
const warning = Modal.warning;

// 获取个人标签和个人介绍的Mapping（label和字段）标识
const ADVISER_INFO = 'ADVISER_INFO';
// 审批中的状态标识
const APPROVING = 'approving';
// 个人介绍最多字数
const MAX_INTRODUCE = 135;

@Form.create()
@withRouter
export default class BasicInfo extends PureComponent {
  static propTypes = {
    userBaseInfo: PropTypes.object.isRequired,
    editorState: PropTypes.bool.isRequired,
    allLabels: PropTypes.array.isRequired,
    LabelAndDescApprover: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    userInfoForm: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    changeEditorState: PropTypes.func.isRequired,
    queryAllLabels: PropTypes.func.isRequired,
    queryApprovers: PropTypes.func.isRequired,
    updateEmpInfo: PropTypes.func.isRequired,
    queryEmpInfo: PropTypes.func.isRequired,
    cacheUserInfoForm: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static contextTypes = {
    empInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      newLabel: [],
      // 选择审批人弹窗状态
      approverModal: false,
      // 选择标签弹窗状态
      selectLabelState: false,
      approver: {},
      applyingDescription: '',
    };
  }

  componentWillMount() {
    const { userInfoForm, location: { query } } = this.props;
    const { cache } = query;
    const { newLabel = [], approver = {}, editorState, applyingDescription } = userInfoForm;
    if (editorState && cache) {
      this.setState({
        newLabel,
        approver,
        applyingDescription,
      });
    }
    this.moreLabel();
  }

  componentDidMount() {
    const { cacheUserInfoForm,
      replace,
      location: { pathname },
    } = this.props;
    // 不改动以前的逻辑，保证缓存的数据的生命周期从Unmount到DidMount
    cacheUserInfoForm({});
    // 记录入口，判断是通过标签进入还是通过FSP菜单进入
    replace({
      pathname,
      query: {
        cache: true,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userBaseInfo } = this.props;
    const { newLabel } = this.state;
    const { userBaseInfo: newUserBaseInfo } = nextProps;
    if (userBaseInfo !== newUserBaseInfo) {
      const {
        labels = [],
      } = newUserBaseInfo;
      this.setState({
        newLabel: _.isEmpty(newLabel) ? labels : newLabel,
      });
    }
  }

  componentWillUnmount() {
    const { cacheUserInfoForm, editorState } = this.props;
    const { newLabel, approver } = this.state;
    const { getFieldValue } = this.props.form;
    const applyingDescription = getFieldValue('applyingDescription');
    if (editorState) {
      cacheUserInfoForm({
        newLabel,
        applyingDescription,
        approver,
        editorState,
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
            key: 'labels',
          },
        ];
      default:
        return [
          {
            name: '姓名',
            key: 'name',
          },
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
    const { empInfo = {} } = this.context;
    const { tgFlag } = empInfo.empInfo || {};
    return (
      <div className={styles.userImg}>
        <img src={tgFlag ? headerImgUrl : defaultHeader} alt="用户照片" />
      </div>
    );
  }

  // 选择标签事件
  @autobind
  handleLabelCheckBox(labelItem) {
    const { newLabel } = this.state;
    const hasSelected = _.filter(newLabel, item => item.id === labelItem.id);
    this.setState({
      selectLabelState: false,
    });
    if (hasSelected.length) {
      return;
    }
    if (newLabel.length >= 4) {
      warning({
        title: '标签可选数目不超过4条',
        okText: '确认',
      });
    } else {
      this.setState((preState) => {
        const nextNewLabel = _.concat(preState.newLabel, labelItem);
        return {
          newLabel: nextNewLabel,
        };
      });
    }
    // 记录日志，选择标签
    logCommon({
      type: 'DropdownSelect',
      payload: {
        name: '选择标签',
        value: JSON.stringify(labelItem),
      },
    });
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
            split={false}
            dataSource={allLabels}
            renderItem={item => (
              <List.Item>
                <div
                  onClick={() => this.handleLabelCheckBox(item)}
                  className={`${labelsId.includes(item.id) ? 'selected' : ''}`}
                >
                  {item.name}
                </div>
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

  // 加载标签
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
  // 打开标签Popover
  @autobind
  openPopover() {
    this.setState(preState => ({
      selectLabelState: !preState.selectLabelState,
    }));
  }
  // 打开审批人选择审批人model
  @autobind
  @logPV({ pathname: '/modal/approverBoardFrame', title: '选择审批人弹框' })
  openApproverBoard() {
    const { queryApprovers, LabelAndDescApprover } = this.props;
    if (!LabelAndDescApprover.length) {
      queryApprovers();
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
  @logable({ type: 'ButtonClick', payload: { name: '取消编辑状态' } })
  cancelEditor() {
    const { changeEditorState, userBaseInfo } = this.props;
    const {
      labels = [],
    } = userBaseInfo;
    this.setState({
      newLabel: labels,
      applyingDescription: '',
      approver: {},
    });
    changeEditorState();
  }
  // 选择审批人
  @autobind
  selectApprover(approver) {
    this.setState({
      approver,
    });
  }

  // 提交审批
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '提交审批' } })
  startApproval() {
    const {
      updateEmpInfo,
      queryEmpInfo,
    } = this.props;
    const { newLabel, approver } = this.state;
    const finalLabels = _.map(newLabel, item => item.id);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        updateEmpInfo({
          applyingDescription: values.applyingDescription,
          labels: finalLabels,
          approver: approver.empNo,
        }).then(() => {
          this.cancelEditor();
          queryEmpInfo();
        });
      }
    });
  }

  // 判断是否可以提交
  canSubmit() {
    const { approver, newLabel } = this.state;
    const { getFieldValue } = this.props.form;
    const applyingDescription = getFieldValue('applyingDescription');
    return applyingDescription && !_.isEmpty(newLabel) && !_.isEmpty(approver);
  }

  render() {
    const {
      userBaseInfo,
      editorState,
      LabelAndDescApprover,
      form: {
        getFieldDecorator,
        getFieldError,
      },
      changeEditorState,
      userBaseInfo: {
        labels = [],
      },
    } = this.props;
    const { newLabel, approverModal, approver, applyingDescription, selectLabelState } = this.state;
    // 当前
    const approveSelectData = _.map(LabelAndDescApprover, item => ({ ...item, empNo: item.login }));
    const isApproving = APPROVING === userBaseInfo.flowState;
    const { empName = '' } = approver;
    const { empInfo = {} } = this.context;
    const { tgFlag } = empInfo.empInfo || {};
    return (
      <div
        className={styles.basicInfo}
      >
        <div className={styles.userInfo}>
          <div className={styles.headerImg}>
            <Card
              cover={this.headerImg(userBaseInfo.photograph)}
            />
          </div>
          <div className={styles.userInfoDesc}>
            <List
              dataSource={this.getBaseInfoMapping()}
              renderItem={
                item => (
                  <List.Item>
                    <b className={styles.infoLabel}>{item.name}:</b>
                    {userBaseInfo[item.key] || '--'}
                  </List.Item>
                )
              }
            />
          </div>
        </div>
        {
          tgFlag ?
            (
              <Form layout="inline">
                <Divider />
                <div className={styles.title}>
                  <Divider type="vertical" className={styles.itemDivider} />
                  <span>个性化信息</span>
                  {
                    !editorState ?
                      <Icon
                        onClick={isApproving ? null : changeEditorState}
                        className={`${styles.editor} ${isApproving ? styles.isApprove : ''}`}
                        type="bianji"
                      /> :
                      null
                  }
                </div>
                <div className={styles.personalDesc}>
                  <List
                    dataSource={this.getBaseInfoMapping(ADVISER_INFO)}
                    renderItem={
                      (item, index) => (
                        // 个人介绍
                        (<List.Item>
                          <div className={styles.label}>
                            <div className={editorState ? styles.required : ''}>{item.name}:</div>
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
                                      rules: [{ max: MAX_INTRODUCE, message: `个人介绍最多${MAX_INTRODUCE}个汉字` }],
                                      initialValue: applyingDescription || userBaseInfo[item.key],
                                    })(
                                      <TextArea
                                        autosize={{ minRows: 4, maxRows: 6 }}
                                      />) :
                                    userBaseInfo[item.key] || '--'
                                }
                                <span className={styles.errorInfoItem}>
                                  {
                                    editorState ?
                                      getFieldError('applyingDescription') || '' :
                                      null
                                  }
                                </span>
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
                                  editorState ?
                                    <Popover
                                      placement="topLeft"
                                      content={this.selectLabelContent()}
                                      trigger="click"
                                      overlayClassName={styles.labelPopover}
                                      visible={selectLabelState}
                                      onVisibleChange={this.openPopover}
                                    >
                                      {
                                        selectLabelState ?
                                          <Tag
                                            className={styles.selectLabelBtn}
                                          >
                                            <span>请选择标签<Icon type="xiangxia" /></span>
                                          </Tag> :
                                          <Tag
                                            color="gold"
                                            className={styles.addLabel}
                                          >
                                            <span><Icon type="jia" /> 添加标签</span>
                                          </Tag>
                                      }
                                    </Popover> :
                                    null
                                }
                                {
                                  !editorState && !labels.length ?
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
                      <div className={styles.selectApprover}>
                        <Divider />
                        <span onClick={this.openApproverBoard}>
                          <FormItem
                            label="选择审批人"
                          >
                            {getFieldDecorator('approver', {
                              rules: [{
                                required: true, message: '请选择审批人',
                              }],
                              initialValue: empName,
                            })(
                              <Search
                                placeholder="搜索内容"
                                style={{ width: 200 }}
                                readOnly
                              />,
                            )}
                          </FormItem>
                        </span>
                      </div> :
                      null
                  }
                </div>
              </Form>
            ) :
            null
        }
        {
          editorState ?
            <div className={styles.editorInfoSubmit}>
              <Button onClick={this.cancelEditor}>取消</Button>
              <Button onClick={this.startApproval} disabled={!this.canSubmit()} type="primary">提交审批</Button>
            </div> :
            null
        }
        {
          <ChoiceApproverBoard
            visible={approverModal}
            approverList={approveSelectData}
            onClose={() => this.closeApproverBoard('approverModal')}
            onOk={this.selectApprover}
          />
        }
      </div>
    );
  }
}
