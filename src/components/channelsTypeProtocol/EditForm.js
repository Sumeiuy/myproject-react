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
// import { dateFormat } from '../../utils/helper';
import styles from './editForm.less';

// test
import {
    subscribelData,
} from '../../routes/templeModal/MockTableData';

const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
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
    // 模板列表
    templateList: PropTypes.array.isRequired,
    // 协议详情-编辑时传入
    protocolDetail: PropTypes.object,
    // 查询子类型/操作类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    // 查询协议编号
    // onSearchProtocolNum: PropTypes.func.isRequired,
    // protocolNumList: PropTypes.array,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 所选模板对应协议条款列表
    protocolClauseList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    protocolDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    const isEdit = !_.isEmpty(props.protocolDetail);
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
    return Object.assign(EMPTY_OBJECT, baseInfoData, this.state);
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
    console.log('protocolList', flag, newSelect, changeSecondArray);
  }

  render() {
    const {
      // 客户列表
      custList,
      // 查询客户
      onSearchCutList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 模板列表
      templateList,
      // 操作类型列表
      operationList,
      // 子类型列表
      subTypeList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
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
      name: '南京营业部 张全蛋',
      date: '2017/08/31',
      status: '1',
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
          queryChannelProtocolItem={queryChannelProtocolItem}
          onSearchCutList={onSearchCutList}
          custList={custList}
          templateList={templateList}
          ref={ref => this.editBaseInfoComponent = ref}
          queryTypeVaules={queryTypeVaules}
          operationList={operationList}
          subTypeList={subTypeList}
        />
        {
          isEdit ?
            <DraftInfo data={draftInfo} /> :
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
            data={protocolClauseList}
            titleList={protocolClauseTitleList}
          />
        </div>
      </div>
    );
  }

}
