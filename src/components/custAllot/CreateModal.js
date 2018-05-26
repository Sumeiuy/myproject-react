/*
 * @Description: 分公司客户划转 home 页面
 * @Author: XuWenKang
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-25 09:39:38
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message, Modal, Upload } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import BottonGroup from '../permission/BottonGroup';
// import TableDialog from '../common/biz/TableDialog';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import logable, { logPV } from '../../decorators/logable';
import { request } from '../../config';
import { emp } from '../../helper';
import config from './config';
import CustAllotXLS from './custAllot.xls';
import styles from './createModal.less';

// 表头
const { titleList } = config;

export default class CreateModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    custRangeList: PropTypes.array.isRequired,
    queryAppList: PropTypes.func.isRequired,
    // 获取按钮数据和下一步审批人
    buttonData: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 获取客户数据
    custData: PropTypes.object.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 已添加客户
    addedCustData: PropTypes.object.isRequired,
    queryAddedCustList: PropTypes.func.isRequired,
    // 服务经理数据
    manageData: PropTypes.object.isRequired,
    queryManageList: PropTypes.func.isRequired,
    // 已添加服务经理
    addedManageData: PropTypes.object.isRequired,
    queryAddedManageList: PropTypes.func.isRequired,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 弹窗的key
    modalKey: PropTypes.string.isRequired,
    custModalKey: PropTypes.string.isRequired,
    manageModalKey: PropTypes.string.isRequired,
    // 打开弹窗
    showModal: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    custVisible: PropTypes.bool.isRequired,
    manageVisible: PropTypes.bool.isRequired,
    updateList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否是初始划转方式
      isDefaultType: true,
      // 上传后的返回值
      attachment: '',
      // 导入的弹窗
      importVisible: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
    };
  }

  componentDidMount() {
    // 获取下一步骤按钮列表
    this.props.queryButtonList({
      flowId: '',
      operate: 1,
    });
  }

  // 导入数据
  @autobind
  @logPV({ pathname: '/modal/importData', title: '导入数据' })
  onImportHandle() {
    this.setState({
      importVisible: true,
    });
  }

  // 上传事件
  @autobind
  @logable({ type: 'Click', payload: { name: '导入' } })
  handleFileChange(info) {
    this.setState({
      importVisible: false,
    }, () => {
      const uploadFile = info.file;
      if (uploadFile.response && uploadFile.response.code) {
        if (uploadFile.response.code === '0') {
          // 上传成功
          const data = uploadFile.response.resultData;
          const { updateList } = this.props;
          const payload = {
            id: '',
            custtomer: [],
            manage: [],
            type: 'add',
            attachment: data,
          };
          // 发送请求
          updateList(payload).then(() => {
            this.setState({
              attachment: data,
            });
          });
        } else {
          // 上传失败
          message.error(uploadFile.response.msg);
        }
      }
    });
  }

  // 发送请求
  @autobind
  sendRequest(obj) {
    const { client, newManager } = this.state;
    const {
      saveChange,
      queryAppList,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const payload = {
      custId: client.custId,
      custType: client.custType,
      // integrationId: newManager.newIntegrationId,
      integrationId: emp.getOrgId(),
      orgName: newManager.newOrgName,
      postnName: newManager.newPostnName,
      postnId: newManager.newPostnId,
      brokerNumber: client.brokerNumber,
      auditors: obj.auditors,
      login: newManager.newLogin,
    };
    saveChange(payload).then(() => {
      message.success('划转请求提交成功');
      this.emptyData();
      this.setState({
        // isShowModal: false,
        // TODO:关闭弹窗事件
      }, () => {
        // 清空掉从消息提醒页面带过来的 id,appId
        queryAppList({ ...query, id: '', appId: '' }, pageNum, pageSize);
      });
    });
  }


  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '否' } })
  importHandleCancel() {
    this.setState({
      importVisible: false,
    });
  }

  @logable({ type: 'Click', payload: { name: '下载模板' } })
  handleDownloadClick() {}


  render() {
    const {
      buttonData,
      visible,
      modalKey,
      // custModalKey,
      manageModalKey,
      showModal,
      closeModal,
    } = this.props;
    const {
      importVisible,
      attachment,
    } = this.state;
    const uploadProps = {
      data: {
        empId: emp.getId(),
        attachment: '',
      },
      action: `${request.prefix}/file/uploadTemp`,
      headers: {
        accept: '*/*',
      },
      onChange: this.handleFileChange,
      showUploadList: false,
    };
    // const { list: custList, page: custPage } = custData;
    // const { list: manageList, page: managePage } = <manageDa></manageDa>ta;
    // 客户列表分页
    const custListPaginationOption = {
      current: 1,
      total: 10,
      pageSize: 10,
      onChange: this.custPageChangeHandle,
    };
    // 服务经理列表分页
    const manageListPaginationOption = {
      current: 1,
      total: 10,
      pageSize: 10,
      onChange: this.managePageChangeHandle,
    };

    const uploadElement = _.isEmpty(attachment) ?
      (<Upload {...uploadProps}>
        <a>批量导入数据</a>
      </Upload>)
    :
      (<span><a onClick={this.onImportHandle}>批量导入数据</a></span>);
    const selfBtnGroup = (<BottonGroup
      list={buttonData}
      onEmitEvent={this.handleSubmit}
    />);
    // const searchProps = {
    //   visible: nextApproverModal,
    //   onOk: this.sendModifyRequest,
    //   onCancel: () => { this.setState({ nextApproverModal: false }); },
    //   dataSource: nextApproverList,
    //   columns: approvalColumns,
    //   title: '选择下一审批人员',
    //   placeholder: '员工号/员工姓名',
    //   modalKey: 'nextApproverModal',
    //   rowKey: 'login',
    //   searchShow: false,
    // };
    return (
      <CommonModal
        title="新建分公司客户分配"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
        selfBtnGroup={selfBtnGroup}
        wrapClassName={styles.createModal}
      >
        <div className={styles.modalContent}>
          <div className={styles.contentItem}>
            <h3 className={styles.title}>客户列表</h3>
            {/* 操作按钮容器 */}
            <div className={`${styles.operateDiv} clearfix`}>
              {/* <Button onClick={() => showModal(custModalKey)}>
                添加
              </Button> */}
              <span className={styles.linkSpan}>
                <a
                  onClick={this.handleDownloadClick}
                  href={CustAllotXLS} className={styles.downloadLink}
                >
                  下载导入模板
                </a>
                { uploadElement }
              </span>
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                data={[]}
                titleList={titleList.cust}
              />
              <Pagination {...custListPaginationOption} />
            </div>
          </div>
          <div className={styles.contentItem}>
            <h3 className={styles.title}>服务经理列表</h3>
            {/* 操作按钮容器 */}
            <div className={`${styles.operateDiv} clearfix`}>
              <Button onClick={() => showModal(manageModalKey)}>
                添加
              </Button>
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                data={[]}
                titleList={titleList.manage}
              />
              <Pagination {...manageListPaginationOption} />
            </div>
          </div>
          <div className={styles.contentItem}>
            <h3 className={styles.title}>客户分配规则</h3>
          </div>
          <Modal
            visible={importVisible}
            title="提示"
            onCancel={this.importHandleCancel}
            footer={[
              <Button style={{ marginRight: '10px' }} key="back" onClick={this.importHandleCancel}>
                取消
              </Button>,
              <Upload {...uploadProps} {...this.props}>
                <Button key="submit" type="primary">
                  确定
                </Button>
              </Upload>,
            ]}
          >
            <p>导入后将清空客户列表已有数据，请确认！</p>
          </Modal>
        </div>
        {/* <TableDialog {...searchProps} /> */}
      </CommonModal>
    );
  }
}
