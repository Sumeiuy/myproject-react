/*
 * @Description: 通道类型协议新建/修改 页面
 * @Author: XuWenKang
 * @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-31 18:09:40
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import EditBaseInfo from './EditBaseInfo';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import SearchSelect from '../common/Select/SearchSelect';
import CommonTable from '../common/biz/CommonTable';
import MultiUpload from '../common/biz/MultiUpload';
import Transfer from '../../components/common/biz/TableTransfer';
import Button from '../common/Button';
import { seibelConfig } from '../../config';
import styles from './editForm.less';

// test
import {
    subscribelData,
    // productColumns,
} from '../../routes/templeModal/MockTableData';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// const EMPTY_PARAM = '暂无';
// const BOOL_TRUE = true;
const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
} = seibelConfig.channelsTypeProtocol;

export default class EditForm extends PureComponent {
  static propTypes = {
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    // 查询协议模板
    onSearchProtocolTemplate: PropTypes.func.isRequired,
    protocolTemplateList: PropTypes.array.isRequired,
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
      customerList: [
        {
          key: 0,
          customerType: '白金',
          custLevelCode: '805015',
          customerEconNum: '666626443512',
          customerName: '刘**',
          customerId: '1-3YOO83T',
          customerStatus: '无',
        },
      ],
    };
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

  @autobind
  changeFunction(value) {
    const { customerList } = this.state;
    console.warn(value);
    const newValue = {
      key: new Date().getTime(),
      customerType: value.custLevelName,
      customerEconNum: value.brokerNumber,
      customerName: value.custName,
      customerId: value.cusId,
      customerStatus: '无',
    };
    const newCustomerList = _.cloneDeep(customerList);
    newCustomerList.push(newValue);
    // console.warn('newCustomerList.push(newValue)', newCustomerList.push(newValue));
    this.setState({
      customerList: newCustomerList,
    });
  }

  @autobind
  changeValue(value) {
    console.warn('value', value);
  }

  render() {
    const {
      custList,
      onSearchCutList,
      onSearchProtocolTemplate,
      protocolTemplateList,
      templateDetail,
    } = this.props;
    const {
      isEdit,
      customerList,
    } = this.state;
    // 新建协议产品按钮
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addProtocolProductModal'),
    };
    const dataSource = [
      {
        cusId: '1-3YOO83T',
        custName: '刘**',
        brokerNumber: '666626443512',
        custLevelCode: '805015',
        custLevelName: '白金',
        custTotalAsset: '669691.9',
        custType: 'per',
        custOpenDate: '2016-07-22 00:00:00',
        riskLevel: 'ul',
        openOrgName: 'ul',
        openOrgId: 'ull',
      },
      {
        cusId: '1-3XY7RZB',
        custName: '陈**',
        brokerNumber: '666626312285',
        custLevelCode: '805020',
        custLevelName: '金',
        custTotalAsset: '.9',
        custType: 'per',
        custOpenDate: '2016-07-01 00:00:00',
        riskLevel: null,
        openOrgName: null,
        openOrgId: null,
      },
      {
        cusId: '1-3VVP0SR',
        custName: '史**',
        brokerNumber: '666625970268',
        custLevelCode: '805015',
        custLevelName: '白金',
        custTotalAsset: '97.3',
        custType: 'per',
        custOpenDate: '2016-04-25 00:00:00',
        riskLevel: null,
        openOrgName: null,
        openOrgId: null,
      },
    ];
    // 拟稿人信息
    const draftInfo = {
      name: '南京营业部 张全蛋',
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
      subscribeTitle: '待选协议产品',
      unsubscribeTitle: '已选协议产品',
      firstData: subscribelData,
      firstColumns: protocolProductTitleList,
      secondColumns: protocolProductTitleList,
      transferChange: this.handleTransferChange,
      rowKey: 'key',
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
          ref={ref => this.editBaseInfoComponent = ref}
        />
        {
          isEdit ?
            <div className={styles.editWrapper}>
              <InfoTitle head="拟稿信息" />
              <InfoItem label="拟稿人" value={draftInfo.name} />
              <InfoItem label="提请时间" value={draftInfo.date} />
              <InfoItem label="状态" value={draftInfo.status} />
            </div>
          :
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
        <div className={styles.editWrapper}>
          <InfoTitle head="下挂客户" />
          <SearchSelect
            onAddCustomer={this.changeFunction}
            onChangeValue={this.changeValue}
            width="184px"
            labelName="客户"
            dataSource={dataSource}
          />
          <CommonTable
            data={customerList || []}
            titleList={underCustTitleList}
          />
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle head="附件" />
          <MultiUpload
            attachmentList={[]}
            attachment={''}
            title={'影像资料（必填）'}
            edit
          />
          <MultiUpload
            attachmentList={[]}
            attachment={''}
            title={'影像资料（必填）'}
            edit
          />
        </div>
      </div>
    );
  }
}
