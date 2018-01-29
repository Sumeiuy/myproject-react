/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-29 15:00:14
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Button, Modal, Upload } from 'antd';
import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import InfoForm from '../../components/common/infoForm';
import DropDownSelect from '../../components/common/dropdownSelect';
import Select from '../../components/common/Select';
import CommonTable from '../../components/common/biz/CommonTable';
import { seibelConfig, request } from '../../config';
import { closeRctTab } from '../../utils';
import { emp } from '../../helper';
import config from './config';
import commonConfirm from '../common/Confirm';
import customerTemplet from './customerTemplet.xls';
import styles from './createFilialeCustTransfer.less';

const confirm = Modal.confirm;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const { filialeCustTransfer: { titleList } } = seibelConfig;
// 划转方式默认值
const defaultType = config.transferType[0].value;
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};

export default class FilialeCustTransfer extends PureComponent {
  static propTypes = {
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原服务经理
    getOldManager: PropTypes.func.isRequired,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    selectNewManager: PropTypes.func.isRequired,
    // 服务经理数据
    managerData: PropTypes.array,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 提交成功后清除上一次查询的数据
    emptyQueryData: PropTypes.func.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    custList: EMPTY_LIST,
    managerData: EMPTY_LIST,
    newManagerList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.checkUserIsFiliale();
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 所选客户
      client: EMPTY_OBJECT,
      // 所选新服务经理
      newManager: EMPTY_OBJECT,
      // 划转方式默认值--单客户划转
      transferType: defaultType,
    };
  }

  componentWillReceiveProps({ custRangeList }) {
    const oldCustRangeList = this.props.custRangeList;
    if (!_.isEmpty(custRangeList) && oldCustRangeList !== custRangeList) {
      this.checkUserIsFiliale();
    }
  }

  // 判断当前登录用户部门是否是分公司
  @autobind
  checkUserIsFiliale() {
    const { custRangeList } = this.props;
    if (!_.isEmpty(custRangeList)) {
      if (!emp.isFiliale(custRangeList, emp.getOrgId())) {
        Modal.warning({
          title: '提示',
          content: '您不是分公司人员，无权操作！',
          onOk: () => {
            this.handleCancel();
          },
        });
      }
    }
  }

  // 选择客户
  @autobind
  handleSelectClient(v) {
    this.setState({
      client: v,
    }, () => {
      // 选择客户之后触发查询该客户的原服务经理
      const { getOldManager } = this.props;
      getOldManager({
        brokerNumber: v.brokerNumber,
      });
    });
  }

  // 查询客户
  @autobind
  handleSearchClient(v) {
    if (!v) {
      return;
    }
    const { getCustList } = this.props;
    getCustList({
      keyword: v,
    });
  }

  // 选择新服务经理
  @autobind
  handleSelectNewManager(v) {
    this.setState({
      newManager: v,
    }, () => {
      // 将选择的新服务经理和原服务经理数据合并用作展示
      const { selectNewManager } = this.props;
      selectNewManager(v);
    });
  }

  // 查询新服务经理
  @autobind
  handleSearchNewManager(v) {
    if (!v) {
      return;
    }
    const { getNewManagerList } = this.props;
    getNewManagerList({
      login: v,
    });
  }

  // 提交
  @autobind
  handleSubmit() {
    const { client, newManager } = this.state;
    const { managerData } = this.props;
    const managerDataItem = managerData[0];
    if (_.isEmpty(client)) {
      message.error('请选择客户');
      return;
    }
    if (_.isEmpty(newManager)) {
      message.error('请选择新客户经理');
      return;
    }
    if (managerDataItem.hasContract) {
      confirm({
        title: '确认要划转吗?',
        content: '该客户名下有生效中的合作合约，请确认是否划转?',
        onOk: () => {
          this.sendRequest();
        },
      });
      return;
    }
    this.sendRequest();
  }

  // 发送请求
  @autobind
  sendRequest() {
    const { client, newManager } = this.state;
    const { saveChange } = this.props;
    saveChange({
      custId: client.custId,
      custType: client.custType,
      integrationId: newManager.newIntegrationId,
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
    }).then(() => {
      message.success('划转成功');
      this.emptyData();
    });
  }

  // 取消
  @autobind
  handleCancel() {
    closeRctTab({
      id: 'FSP_CROSS_DEPARTMENT',
    });
  }

  // 提交成功后清空数据
  @autobind
  emptyData() {
    const { emptyQueryData } = this.props;
    this.setState({
      client: EMPTY_OBJECT,
      newManager: EMPTY_OBJECT,
    }, () => {
      if (this.queryCustComponent) {
        this.queryCustComponent.clearValue();
        this.queryCustComponent.clearSearchValue();
      }
      if (this.queryManagerComponent) {
        this.queryManagerComponent.clearValue();
        this.queryManagerComponent.clearSearchValue();
      }
      emptyQueryData();
    });
  }

  // 划转方式的 select 事件
  @autobind
  handleSelectChange(key, value) {
    this.setState({
      [key]: value,
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
    const that = this;
    that.setState({ isShowModal: false });
  }


  // 上传事件
  @autobind
  onChange(info) {
    const uploadFile = info.file;
    this.setState({
      file: uploadFile,
    });
    if (uploadFile.response && uploadFile.response.code) {
      if (uploadFile.response.code === '0') {
        // 上传成功的返回值 0
        const data = uploadFile.response.resultData;
        this.setState({
          status: 'success',
          statusText: '上传完成',
          fileList: data.attaches,
          oldFileList: data.attaches,
          attachment: data.attachment,
        });
      } else {
        // 上传失败的返回值 MAG0005
        this.setState({
          status: 'active',
          fileList: this.state.oldFileList,
          file: {},
          percent: 0,
        });
        message.error(uploadFile.response.msg);
      }
    }
  }

  render() {
    const {
      custList,
      newManagerList,
      managerData,
    } = this.props;
    const { transferType } = this.state;
    const uploadProps = {
      data: {
        empId: emp.getId(),
        attachment: '',
      },
      action: `${request.prefix}/file/ceFileUpload`,
      headers: {
        accept: '*/*',
      },
      onChange: this.onChange,
      showUploadList: false,
    };
    return (
      <CommonModal
        title="分公司客户划转申请"
        visible={this.state.isShowModal}
        onOk={this.handleSubmit}
        okText="提交"
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
      >
        <div className={styles.filialeCustTransferWrapper} >
          <div className={styles.filialeCustTransferBox} >
            <div className={styles.selectBox}>
              <div className={styles.selectLeft}>
                <InfoForm style={{ width: 'auto' }} label="划转方式" required>
                  <Select
                    name="transferType"
                    data={config.transferType}
                    value={transferType}
                    onChange={this.handleSelectChange}
                  />
                </InfoForm>
              </div>
              {
                transferType !== defaultType ?
                  <div className={styles.selectRight}>
                    <div className={styles.buttonBox}>
                      <Upload {...uploadProps} {...this.props}>
                        <Button type="primary">
                          导入
                        </Button>
                      </Upload>
                      <a href={customerTemplet} className={styles.downloadLink}>下载模板</a>
                    </div>
                  </div>
                :
                  null
              }
            </div>
            {/* 划转方式是否等于默认值 */}
            {
              transferType === defaultType ?
                <div className={styles.selectBox}>
                  <div className={styles.selectLeft}>
                    <InfoForm style={{ width: 'auto' }} label="选择客户" required>
                      <DropDownSelect
                        placeholder="选择客户"
                        showObjKey="custName"
                        objId="brokerNumber"
                        value=""
                        searchList={custList}
                        emitSelectItem={this.handleSelectClient}
                        emitToSearch={this.handleSearchClient}
                        boxStyle={dropDownSelectBoxStyle}
                        ref={ref => this.queryCustComponent = ref}
                      />
                    </InfoForm>
                  </div>
                  <div className={styles.selectRight}>
                    <InfoForm style={{ width: 'auto' }} label="选择新服务经理" required>
                      <DropDownSelect
                        placeholder="选择新服务经理"
                        showObjKey="showSelectName"
                        value=""
                        searchList={newManagerList}
                        emitSelectItem={this.handleSelectNewManager}
                        emitToSearch={this.handleSearchNewManager}
                        boxStyle={dropDownSelectBoxStyle}
                        ref={ref => this.queryManagerComponent = ref}
                      />
                    </InfoForm>
                  </div>
                </div>
              :
                null
            }
            <CommonTable
              data={managerData}
              titleList={titleList}
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}
