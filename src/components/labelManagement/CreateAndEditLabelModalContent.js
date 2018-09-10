/* 标签管理新建编辑标签模态框
 * @Author: WangJunJun
 * @Date: 2018-08-05 20:41:23
 * @Last Modified by: WangJunJun
 * @Last Modified time: 2018-08-31 12:25:37
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, message, Modal, Upload, Alert, Spin } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import confirm from '../common/confirm_';
import Table from '../common/commonTable';
import Search from '../common/Search';
import Select from '../common/Select';
import Button from '../common/Button';

import tableStyles from '../common/commonTable/index.less';
import styles from './createAndEditLabelModalContent.less';
import logable from '../../decorators/logable';
import { request } from '../../config';
import { emp } from '../../helper';
import { config, LABEL_NAME_REG, labelCustColumns } from './config';
import customerTemplet from './customerTemplet.xlsx';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const searchStyle = {
  height: '30px',
  width: '200px',
};

// 添加客户方式默认值
const defaultType = config.customerAddType[0].value;
const FormItem = Form.Item;

@Form.create()
export default class CreateAndEditLabelModalContent extends PureComponent {
  static propTypes = {
    detailData: PropTypes.object,
    form: PropTypes.object.isRequired,
    customerList: PropTypes.object.isRequired,
    customerHotPossibleWordsList: PropTypes.array.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    canEditDetail: PropTypes.bool,
    // 获取标签下的客户列表
    getGroupCustomerList: PropTypes.func.isRequired,
    // 风险等级字典
    custRiskBearing: PropTypes.array,
    // 编辑情况下，添加客户到标签下的列表
    onAddCustomerToLabel: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    // 批量导入客户信息
    queryBatchCustList: PropTypes.func.isRequired,
    batchCustList: PropTypes.object.isRequired,
    checkDuplicationName: PropTypes.func.isRequired,
    // 删除标签下的客户
    deleteLabelCust: PropTypes.func.isRequired,
    isCreateLabel: PropTypes.bool,
  };

  static defaultProps = {
    detailData: EMPTY_OBJECT,
    canEditDetail: true,
    custRiskBearing: [],
    isCreateLabel: true,
  };

  constructor(props) {
    super(props);
    const { name = '', description = '', id = '' } = props.detailData;
    this.state = {
      name,
      description,
      curPageNum: 1,
      curPageSize: 10,
      id,
      record: {},
      totalRecordNum: 0,
      originRecordNum: 0,
      includeCustList: EMPTY_LIST,
      includeCustListSize: 0,
      dataSource: EMPTY_LIST,
      custIds: [],
      needDeleteBrokerNumber: '',
      curPageCustList: EMPTY_LIST,
      // 客户添加方式默认值--单客户添加
      customerAddType: defaultType,
      // 是否是初始客户添加方式
      isDefaultType: true,
      // 上传后的返回附件Id值
      attachmentId: '',
      // 附件上传报错信息
      multiErrmsg: '',
      // 再次导入提醒的弹窗
      importVisible: false,
      // 当前上传的文件
      file: {},
      // 上传文件的loading
      uploadLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { customerList: prevList = EMPTY_OBJECT } = prevProps;
    const { custInfoVOList: prevData = EMPTY_LIST } = prevList;
    const { customerList = EMPTY_OBJECT } = this.props;
    const { custInfoVOList = EMPTY_LIST, totalRecordNum } = customerList;
    if (prevData !== custInfoVOList) {
      this.setState({  // eslint-disable-line
        dataSource: custInfoVOList,
        // 总条目与当前新增cust条目相加
        totalRecordNum,
      });
    }
  }

  // 导入数据
  @autobind
  onImportHandle() {
    this.setState({
      importVisible: true,
    });
  }

  @autobind
  importHandleCancel() {
    this.setState({
      importVisible: false,
    });
  }

  @autobind
  getData() {
    const { id, custIds } = this.state;
    return {
      id,
      custIds,
    };
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  /**
   * 获取本页数据，从服务器获取或者本地分页
   * @param {*} curPage 当前页
   * @param {*} curPageSize 当前分页条目
   */
  @autobind
  getCurPageData(curPage, curPageSize) {
    const { getGroupCustomerList } = this.props;
    const { id = '', includeCustList } = this.state;
    if (_.isEmpty(id)) {
      // 如果groupId是空，则直接取includeCustList中的数据
      const data = _.slice(includeCustList, (curPage - 1) * curPageSize,
        curPage * curPageSize);
      this.setState({
        curPageCustList: data,
      });
    } else {
      getGroupCustomerList({
        labelId: id,
        pageNum: curPage,
        pageSize: curPageSize,
      });
    }
  }

  /**
  * 页码改变事件，翻页事件
  * @param {*} nextPage 下一页码
  * @param {*} curPageSize 当前页条目
  */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    this.getCurPageData(nextPage, currentPageSize);
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    this.getCurPageData(currentPageNum, changedPageSize);
  }

  @autobind
  deleteCustomerFromLabel(record) {
    const {
      custIds,
      totalRecordNum,
      includeCustList,
      id,
      curPageSize,
      includeCustListSize,
    } = this.state;
    const { custId, brokerNumber } = record;
    // 新增下删除客户从includeCustIdList删除
    const newIncludeCustList = _.filter(includeCustList, item => item.custId !== custId);
    const newIncludeCustIdList = _.filter(custIds, item => item !== custId);

    if (_.includes(custIds, custId)) {
      this.setState({
        custIds: newIncludeCustIdList,
        includeCustList: newIncludeCustList,
        includeCustListSize: includeCustListSize - 1,
      });
    }

    if (_.isEmpty(id)) {
      const {
        curPageCustList,
        includeCustListSize: newCustListSize,
        curPage,
      } = this.generateLocalPageAndDataSource(newIncludeCustList, curPageSize);

      this.setState({
        // 总记录数减1
        totalRecordNum: totalRecordNum - 1,
        curPageCustList,
        includeCustListSize: newCustListSize,
        curPageNum: curPage,
      }, () => {
        const { totalRecordNum: numAfterDelete } = this.state;
        if (numAfterDelete < 1) {
          this.setState({
            attachmentId: '',
          });
        }
      });
    } else {
      // 直接提示删除确认框，然后删除
      confirm({
        onOk: this.deleteLabelCustForever,
        onCancel: _.noop,
      });
    }
    this.setState({
      needDeleteBrokerNumber: brokerNumber,
    });
  }


  // 客户添加方式的 select 切换事件
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '添加方式',
      value: '$args[1]',
    },
  })
  handleSelectChange(key, value) {
    const { custIds, id } = this.state;
    // 新建页面切换客户添加方式，需要将之前已经存在的附件、报错信息置空
    this.setState({
      attachmentId: '',
      multiErrmsg: '',
      importVisible: false,
      file: {},
    });
    // groupId为空，为新建页面
    // includeCustIdList不为空，说明已经添加了客户，此时若切换需要弹出提示信息
    if (!_.isEmpty(custIds) && _.isEmpty(id)) {
      Modal.confirm({
        title: '确认切换客户添加方式吗?',
        content: '在新增模式下，新添加的客户需要提交才能生效，如果切换添加客户方式将会覆盖之前的数据，是否切换?',
        onOk: () => {
          const isDefaultType = value === defaultType;
          // 新建页面切换客户添加方式，需要将之前已经存在的数据置空
          this.setState({
            [key]: value,
            isDefaultType,
            custIds: [],
            curPageCustList: [],
            includeCustList: [],
            totalRecordNum: 0,
          });
        },
        okText: '确认',
        cancelText: '取消',
      });
    } else {
      const isDefaultType = value === defaultType;
      this.setState({
        [key]: value,
        isDefaultType,
      });
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索客户',
      value: '$args[0].value',
    },
  })
  handleSearchClick({ value }) {
    const { getHotPossibleWds } = this.props;
    getHotPossibleWds({
      keyword: value,
    });
  }

  @autobind
  handleAddCustomerFromSearch(selectedItem) {
    if (_.isEmpty(selectedItem)) {
      return;
    }
    const { custName, custLevelName, riskLevel, brokerNumber } = selectedItem;
    const {
      custIds,
      totalRecordNum,
      includeCustList,
      id,
      // curPageNum,
      curPageSize,
      name,
      description,
    } = this.state;
    const { custRiskBearing, onAddCustomerToLabel } = this.props;
    const riskLevelObject = _.find(custRiskBearing, item => item.key === riskLevel) || EMPTY_OBJECT;

    // 判断custIds是否存在brokerNumber
    if (_.includes(custIds, brokerNumber)) {
      message.error('此客户已经添加过');
      return;
    }
    // 入参改变，后端要求传包含custId数组
    const newCustIdList = [...custIds, brokerNumber];

    // 如果groupId不为空，则添加直接调用接口，添加
    if (_.isEmpty(id)) {
      // 数据添加进表格
      // 新添加的数据放在表格的前面
      const newIncludeCustList = _.concat([{
        custName,
        custId: brokerNumber,
        levelName: custLevelName,
        riskLevelName: riskLevelObject.value,
        id: brokerNumber,
        brokerNumber,
      }], includeCustList);
      const {
        curPageCustList,
        includeCustListSize,
        curPage,
      } = this.generateLocalPageAndDataSource(newIncludeCustList, curPageSize);

      this.setState({
        // 手动新增的所有数据集合
        includeCustList: newIncludeCustList,
        includeCustListSize,
        totalRecordNum: totalRecordNum + 1,
        curPageCustList,
        curPageNum: curPage,
      });
    } else {
      // groupId不为空，直接调用add接口
      onAddCustomerToLabel({
        custIds: newCustIdList,
        name,
        description,
      });
    }

    // 将数据添加进includeCustIdList
    this.setState({
      custIds: newCustIdList,
    });
  }

  @autobind
  generateLocalPageAndDataSource(newIncludeCustList, curPageSize) {
    const includeCustListSize = _.size(newIncludeCustList);
    let curPageCustList = EMPTY_LIST;
    const curPage = Math.ceil(includeCustListSize / curPageSize);

    if (curPage <= 1) {
      // 第一页
      curPageCustList = _.slice(newIncludeCustList, 0, includeCustListSize);
    } else {
      // 大于一页
      curPageCustList = _.slice(newIncludeCustList,
        (curPage - 1) * curPageSize, includeCustListSize);
    }

    return {
      curPageCustList,
      includeCustListSize,
      curPage,
    };
  }

  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '删除标签下的单个客户',
    },
  })
  handleDeleteBtnClick(record) {
    this.setState({
      // 当前删除行记录数据
      record,
    });
    this.deleteCustomerFromLabel(record);
  }

  @autobind
  deleteLabelCustForever() {
    const { id, needDeleteBrokerNumber, dataSource, totalRecordNum } = this.state;
    this.props.deleteLabelCust({
      labelId: id,
      custId: needDeleteBrokerNumber,
    }).then(() => {
      const newDataSource = _.filter(dataSource,
        item => item.brokerNumber !== needDeleteBrokerNumber,
      );
      // 数据从表格删除
      this.setState({
        dataSource: newDataSource,
        // 总记录数减1
        totalRecordNum: totalRecordNum - 1,
      }, () => {
        if (_.isEmpty(newDataSource) && id) {
          // 判断数据是否不存在了，
          // 并且不是新增
          // 不存在请求数据
          this.props.getGroupCustomerList({
            labelId: id,
            pageNum: 1,
            pageSize: 10,
          });
        }
      });
    });
  }

  // 上传事件
  @autobind
  handleChange(info) {
    this.setState({
      importVisible: false,
      includeCustList: [],
      custIds: [],
      totalRecordNum: 0,
      uploadLoading: true,
    }, () => {
      const uploadFile = info.file;
      this.setState({
        file: uploadFile,
      });
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const data = uploadFile.response.resultData;
          // 上传的文件符合要求
          if (data.isValid) {
            this.setState({
              multiErrmsg: '',
              attachmentId: data.attachmentId,
              uploadLoading: false,
            }, () => {
              const { attachmentId } = this.state;
              const { queryBatchCustList } = this.props;
              const payload = {
                attachmentId,
                pageNum: 1,
                pageSize: 1000,
              };
              // 文件上传成功拿对应的attachmentId调接口解析客户列表请求
              queryBatchCustList(payload).then(() => {
                const {
                  batchCustList,
                  batchCustList: { custList },
                  onAddCustomerToLabel,
                } = this.props;
                const {
                  custIds,
                  totalRecordNum,
                  includeCustList,
                  id,
                  // curPageNum,
                  curPageSize,
                  name,
                  description,
                } = this.state;
                const multiBatchCustList = _.isEmpty(batchCustList) ? [] : custList;
                // 取出数组对象中所有brokerNumber组成一个新的数组
                const custIdList = _.map(multiBatchCustList, 'brokerNumber');
                const custIdListSize = _.size(custIdList);
                const newCustIdList = _.concat(custIds, custIdList);

                // 如果groupId不为空，则添加直接调用接口，添加
                if (_.isEmpty(id)) {
                  // 数据添加进表格
                  // 新添加的数据放在表格的前面
                  const newIncludeCustList = _.concat(multiBatchCustList, includeCustList);

                  const {
                    curPageCustList,
                    includeCustListSize,
                    curPage,
                  } = this.generateLocalPageAndDataSource(newIncludeCustList, curPageSize);

                  this.setState({
                    // 手动新增的所有数据集合
                    custIds: newCustIdList,
                    includeCustList: newIncludeCustList,
                    includeCustListSize,
                    totalRecordNum: totalRecordNum + custIdListSize,
                    curPageCustList,
                    curPageNum: curPage,
                  });
                } else {
                  // groupId不为空，编辑页面直接调用add接口
                  onAddCustomerToLabel({
                    custIds: newCustIdList,
                    name,
                    description,
                  });
                  // 编辑页面调完add接口客户已经分组成功
                  // 此时将attachmentId置为空，为再次点击上传按钮上传做准备
                  this.setState({
                    attachmentId: '',
                  });
                }
              });
            });
          } else {
            // 上传的文件不符合要求，在页面显示做错信息
            this.setState({
              multiErrmsg: data.msg,
              uploadLoading: false,
            });
          }
        } else {
          // 上传失败
          message.error(uploadFile.response.msg);
          this.setState({
            uploadLoading: false,
          });
        }
      }
    });
  }

  // Alert关闭时回调，将multiErrmsg置空
  @autobind
  handleCloseAlert() {
    this.setState({
      multiErrmsg: '',
    });
  }

  /**
  * 为数据源的每一项添加一个id属性
  * @param {*} listData 数据源
  */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.custId }));
    }

    return [];
  }

  renderActionSource() {
    return [{
      type: '删除',
      handler: this.handleDeleteBtnClick,
    }];
  }

  // 实时校验标签名是否重复
  @autobind
  handleCheckLabelName() {
    const { checkDuplicationName, form } = this.props;
    const { labelName: labelNameError } = form.getFieldsError();
    // 校验规则不通过或编辑标签不校验重名
    if (labelNameError || !this.props.isCreateLabel) {
      return;
    }
    form.validateFields(['name'], (error, values) => {
      if (!error) {
        checkDuplicationName({ labelName: values.name, labelFlag: '1' }).then((duplicationName) => {
          if (duplicationName) {
            this.props.form.setFields({
              name: {
                value: values.name,
                errors: [new Error('该标签已存在，请重新输入')],
              },
            });
          }
        });
      }
    });
  }

  render() {
    const {
      name = '',
      description = '',
      curPageNum,
      curPageSize,
      dataSource = EMPTY_LIST,
      totalRecordNum,
      curPageCustList,
      id,
      customerAddType,
      isDefaultType,
      attachmentId,
      multiErrmsg,
      importVisible,
      file,
      uploadLoading,
    } = this.state;
    const {
      form: { getFieldDecorator },
      customerHotPossibleWordsList = EMPTY_LIST,
      getHotPossibleWds,
      canEditDetail,
    } = this.props;
    // 构造operation
    const actionSource = this.renderActionSource();
    // 上传批量客户，不符合要求的报错信息
    const newMultiErrmsg = `注:${multiErrmsg}`;
    // 单客户添加列表数据
    let newDataSource = EMPTY_LIST;
    // 如果存在groupId，是编辑页面，则用dataSource
    // 不存在groupId则是新建页面，用includeCustList
    if (_.isEmpty(id)) {
      newDataSource = curPageCustList;
    } else {
      newDataSource = dataSource;
    }

    // 添加id到dataSource
    newDataSource = this.addIdToDataSource(newDataSource);
    const uploadProps = {
      data: {
        empId: emp.getId(),
        file,
        labelId: id,
        labelName: name,
        labelDesc: description,
      },
      action: `${request.prefix}/file/custgroupUpload`,
      headers: {
        accept: '*/*',
      },
      onChange: this.handleChange,
      showUploadList: false,
    };

    const uploadElement = _.isEmpty(attachmentId) ?
      (<Upload {...uploadProps} {...this.props}>
        <a>客户导入</a>
      </Upload>)
      :
      <a onClick={this.onImportHandle}>客户导入</a>;

    return (
      <Form className={styles.groupDetail}>
        <div className={styles.nameSection}>
          <div className={styles.name}>
            标签名称:
          </div>
          <div className={styles.nameContent}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入标签名称',
                }, {
                  max: 8, message: '最多为8个字',
                }, {
                  min: 4, message: '最少为4个字',
                }, {
                  pattern: LABEL_NAME_REG, message: '可输入字符仅为汉字、数字、字母及合法字符(#&-_@%)',
                }],
                initialValue: name || '',
              })(
                <Input
                  className={styles.labelNameInput}
                  id="nameInput"
                  placeholder={canEditDetail ? '请输入标签名称' : ''}
                  size="default"
                  ref={ref => (this.nameInput = ref)}
                  disabled={!canEditDetail}
                  onBlur={this.handleCheckLabelName}
                />,
              )}
            </FormItem>
          </div>
        </div>
        <div className={styles.descriptionSection}>
          <div className={styles.description}>
            标签描述:
          </div>
          <div className={styles.descriptionContent}>
            <FormItem>
              {getFieldDecorator('description', {
                rules: [{
                  required: true, message: '请输入标签描述',
                }, {
                  min: 10, message: '最少为10个字',
                }, {
                  max: 500, message: '最多为500个字',
                }],
                initialValue: description || '',
              })(
                <Input.TextArea
                  className={styles.labelDescInput}
                  id="descriptionInput"
                  placeholder={canEditDetail ? '请输入标签描述' : ''}
                  size="default"
                  autosize={false}
                  disabled={!canEditDetail}
                  ref={ref => (this.descriptionInput = ref)}
                />,
              )}
            </FormItem>
          </div>
        </div>
        <div className={styles.addWaySection}>
          <div className={styles.addWay}>
            添加方式:
          </div>
          <div className={styles.addWayContent}>
            <Select
              width="220px"
              name="customerAddType"
              data={config.customerAddType}
              value={customerAddType}
              onChange={this.handleSelectChange}
            />
          </div>
        </div>
        <div className={styles.addWaySubSection}>
          {
            isDefaultType ?
              <div className={styles.singleCust}>
                <Search
                  // 请求联想关键词
                  queryPossibleWords={getHotPossibleWds}
                  // 联想出来的数据
                  possibleWordsData={customerHotPossibleWordsList}
                  // 搜索className
                  searchWrapperClass={styles.groupCustomerSearch}
                  // 搜索按钮功能
                  onSearchClick={this.handleSearchClick}
                  // placeholder
                  placeholder="客户号/姓名"
                  // 搜索框style
                  searchStyle={searchStyle}
                  // 是否需要搜索图标
                  isNeedSearchIcon={false}
                  // 是否需要添加按钮
                  isNeedAddBtn
                  // 添加按钮事件
                  addBtnCallback={this.handleAddCustomerFromSearch}
                />
              </div>
              :
              <div className={styles.multiCust}>
                <Spin className={styles.uploadLoading} spinning={uploadLoading} />
                <span className={styles.importCust}>{uploadElement}</span>
                <a href={customerTemplet} className={styles.downloadLink}>下载模板</a>
              </div>
          }
        </div>
        {
          _.isEmpty(multiErrmsg) ?
            null
            :
            <div className={styles.multiErrmsg}>
              <Alert
                message={newMultiErrmsg}
                type="error"
                onClose={this.handleCloseAlert}
                closable
              />
            </div>
        }
        <div className={styles.customerListTable}>
          <Table
            pageData={{
              curPageNum,
              curPageSize,
              totalRecordNum,
            }}
            listData={newDataSource}
            onSizeChange={this.handleShowSizeChange}
            onPageChange={this.handlePageChange}
            tableClass={`${tableStyles.groupTable} ${styles.custListTable}`}
            titleColumn={labelCustColumns}
            actionSource={actionSource}
            isFirstColumnLink={false}
            // 固定标题，内容滚动
            scrollY={186}
            isFixedTitle
            // 当listData数据源为空的时候是否需要填充空白行
            emptyListDataNeedEmptyRow
          />
        </div>
        <Modal
          visible={importVisible}
          title="提示"
          onCancel={this.importHandleCancel}
          footer={[
            <Button style={{ marginRight: '10px' }} onClick={this.importHandleCancel}>
              否
            </Button>,
            <Upload {...uploadProps} {...this.props}>
              <Button key="submit" type="primary">
                是
              </Button>
            </Upload>,
          ]}
        >
          <p>已有导入的数据，继续导入将会覆盖之前导入的数据，是否继续？</p>
        </Modal>
      </Form>
    );
  }
}
