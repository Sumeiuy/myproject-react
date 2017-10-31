/*eslint-disable */
/*
 * @Description: 通道类型协议新建/修改 页面
 * @Author: XuWenKang
 * @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-24 09:24:54
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import EditBaseInfo from './EditBaseInfo';
import DraftInfo from './DraftInfo';
// import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import Transfer from '../../components/common/biz/TableTransfer';
// import ApproveList from '../common/approveList';
// import Approval from '../permission/Approval';
import Button from '../common/Button';

import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';
import styles from './editForm.less';

// test
import {
    subscribelData,
} from '../../routes/templeModal/MockTableData';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// const EMPTY_PARAM = '暂无';
// const BOOL_TRUE = true;
// 协议产品的表头、状态
const { channelsTypeProtocol: { protocolProductTitleList } } = seibelConfig;
// 协议条款的表头、状态
const { channelsTypeProtocol: { protocolClauseTitleList } } = seibelConfig;
export default class EditForm extends PureComponent {
  static propTypes = {
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    // 查询协议模板
    onSearchProtocolTemplate: PropTypes.func.isRequired,
    protocolTemplateList: PropTypes.array.isRequired,
    // 查询子类型/操作类型
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    // 查询协议编号
    // onSearchProtocolNum: PropTypes.func.isRequired,
    // protocolNumList: PropTypes.array,
    // 模板详情
    templateDetail: PropTypes.object,
  }

  static defaultProps = {
    templateDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const isEdit = !_.isEmpty(props.templateDetail);
    this.state = {
      isEdit,
    };
  }

  componentDidMount() {

  }

  // 向父组件提供数据
  @autobind
  getData() {
    const baseInfoData = this.editBaseInfoComponent.getData();
    return Object.assign(EMPTY_OBJECT,baseInfoData,this.state);
  }

  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
      defaultData: {},
      editClause: false,
    });
  }

  // 添加协议产品
  @autobind
  handleTransferChange(flag, newSelect, changeSecondArray) {
    console.log('protocolList',flag, newSelect, changeSecondArray);
  }

  render() {
    const {
      custList,
      onSearchCutList,
      onSearchProtocolTemplate,
      protocolTemplateList,
      templateDetail,
      queryTypeVaules,
      operationList,
      subTypeList,
    } = this.props;
    const {
      isEdit,
    } = this.state;
    // 新建协议产品按钮
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addProtocolProductModal'),
    };
    // 拟稿人信息
    const draftInfo = {
      name: `南京营业部 张全蛋`,
      date: '2017/08/31',
      status: '1',
    };
    // 表格中需要的操作
    const operation = {
      column: {
        // beizhu = edit , shanchu = delete
        key: [
          {
            key: 'beizhu',
            operate: this.editTableData,
          },
          {
            key: 'shanchu',
            operate: this.deleteTableData,
          },
        ], // 'check'\'delete'\'view'
        title: '操作',
      },
    };
    // 添加协议产品组件props
    const pagination = {
        defaultPageSize: 5,
        pageSize: 5,
        size: 'small',
    };
    const transferProps = {
        firstTitle: '待选协议产品',
        secondTitle: '已选协议产品',
        firstData: subscribelData,
        firstColumns: protocolProductTitleList,
        secondColumns: protocolProductTitleList,
        transferChange: this.handleTransferChange,
        rowKey: 'key',
        isScrollX: true,
        showSearch: true,
        placeholder: '产品代码/产品名称',
        pagination,
        supportSearchKey: [['productCode'], ['productName']],
    };
    return (
      <div className={styles.editComponent}>
        <EditBaseInfo
          onSearchCutList={onSearchCutList}
          custList={custList}
          onSearchProtocolTemplate={onSearchProtocolTemplate}
          protocolTemplateList={protocolTemplateList}
          templateDetail={templateDetail}
          ref={ref=>this.editBaseInfoComponent = ref}
          queryTypeVaules={queryTypeVaules}
          operationList={operationList}
          subTypeList={subTypeList}
        />
        {
          isEdit?
          <DraftInfo data={draftInfo} />:
          null
        }
        <div className={styles.editWrapper}>
          <InfoTitle
            head="协议产品"
          />
          <Button {...buttonProps}>新建</Button>
          <Transfer
            {...transferProps}
          />
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle
              head="协议条款"
          />
          <CommonTable
            data={EMPTY_ARRAY}
            titleList={protocolClauseTitleList}
            operation={operation}
          />
        </div>
      </div>
    );
  }

}
/*eslint-disable */