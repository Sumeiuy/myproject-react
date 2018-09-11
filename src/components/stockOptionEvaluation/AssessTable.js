/*
 * @Author: zhangjun
 * @Date: 2018-06-08 09:10:53
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-09-11 15:32:57
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';

import config from './config';
import styles from './assessTable.less';

export default class AssessTable extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  // 处理新开客户和初次申请的tableColumn
  @autobind
  handleColumnTypeIsNew(defaultColumns) {
    const {
      assessEleColumn,
      aptitudeEleColumn,
      assessResultColumn,
    } = defaultColumns;
    return [
      {
        ...assessEleColumn,
        render: (value, row, index) => {
          const obj = {
            children: <div title={value} className={styles.assessItem}>
              {value}</div>,
            props: {},
          };
          // 第4行和第5行的第1列评估要素需要合并成一行，第6行和第7行的第1列评估要素需要合并成一行，所以把第4行和第6行rowSpan设置成2
          if (index === 3 || index === 5) {
            const resultArr = value.split('\n');
            const valueStr = resultArr.join('');
            obj.children = (<div title={valueStr} className={styles.assessItem}>
              {resultArr[0]}<br />{resultArr[1]}</div>);
            obj.props.rowSpan = 2;
          }
          // 第4行与第5行的第1列评估要素合成了一行，第6行与第7行的第1列评估要素合成了一行，所以把第5行和第7行rowSpan设置成0
          if (index === 4 || index === 6) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      aptitudeEleColumn,
      {
        ...assessResultColumn,
        render: (value, record, index) => {
          const obj = {
            children: value,
            props: {},
          };
          // 第1行，第3行，第4行，第6行的第3列评估结果显示格式，比如：符合条件: (XXX)的形式
          if (index === 0 || index === 2 || index === 3 || index === 5) {
            obj.children = this.handleResultByCondRight(record);
          }
          // 第2行的第3列评估结果的显示格式
          if (index === 1) {
            obj.children = this.handleResultByRisK(record);
          }
          // 第5行和第8行的第3列评估结果的显示格式，比如：已通过 (XXX) 学历证明材料
          if (index === 4 || index === 7) {
            obj.children = this.handleResultByCondMiddle(record);
          }
          // 第7行的第3列评估结果的显示格式
          if (index === 6) {
            obj.children = this.handleResultByMoreCond(record);
          }
          return obj;
        },
      },
    ];
  }

  // 处理新开客户投资级别变更申请的tableColumn
  @autobind
  handleColumncustTypeIsNew(defaultColumns) {
    const {
      assessEleColumn,
      aptitudeEleColumn,
      assessResultColumn,
    } = defaultColumns;
    return [
      {
        ...assessEleColumn,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
           // 第3行和第4行的第1列评估要素需要合并成一行，所以把第3行rowSpan设置成2
          if (index === 2) {
            const valueArr = value.split('\n');
            obj.children = (<div> {valueArr[0]}<br />{valueArr[1]}</div>);
            obj.props.rowSpan = 2;
          }
          // 第4行与第3行的第1列评估要素合成了一行，所以把第4行和第6行rowSpan设置成0
          if (index === 3) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      aptitudeEleColumn,
      {
        ...assessResultColumn,
        render: (value, record, index) => {
          const obj = {
            children: value,
            props: {},
          };
          // 第1行，第3行的第3列评估结果显示格式，比如：符合条件: (XXX)的形式
          if (index === 0 || index === 2) {
            obj.children = this.handleResultByCondRight(record);
          }
          // 第2行的第3列评估结果的显示格式
          if (index === 1) {
            obj.children = this.handleResultByRisK(record);
          }
          // 第4行和第5行的第3列评估结果的显示格式，比如：已通过 (XXX) 学历证明材料
          if (index === 3 || index === 4) {
            obj.children = this.handleResultByCondMiddle(record);
          }
          return obj;
        },
      },
    ];
  }

  // 处理多开客户的tableColumn
  @autobind
  handleColumnTypeIsMore(defaultColumns) {
    const {
      assessEleColumn,
      aptitudeEleColumn,
      assessResultColumn,
    } = defaultColumns;
    return [
      assessEleColumn,
      aptitudeEleColumn,
      {
        ...assessResultColumn,
        render: (value, record, index) => {
          const obj = {
            children: value,
            props: {},
          };
          // 第1行的第3列评估结果的显示格式
          if (index === 0) {
            obj.children = this.handleResultByRisK(record);
          }
          // 第2行，第3行的第3列评估结果显示格式，比如：符合条件: (XXX)的形式
          if (index === 1) {
            obj.children = this.handleResultByCondRight(record);
          }
          return obj;
        },
      },
    ];
  }
  // 处理评估结果在最后的评估结果
  // 比如： 符合条件: (XXX)
  @autobind
  handleResultByCondRight(record) {
    const {
      defaultResult,
      assessResult,
    } = record;
    // 鼠标放到表格上，显示的字符串进行重组
    // 格式为：符合条件: (XXX)
    const valueStr = `${defaultResult}（${assessResult}）`;
    return (
      <div title={valueStr} className={styles.assessItem}>
        {defaultResult}（
        <span>{assessResult}</span>
        ）
      </div>
    );
  }

  // 处理风险评估的评估结果
  @autobind
  handleResultByRisK(record) {
    const {
      defaultResult1,
      assessResult,
      defaultResult2,
    } = record;
    // 鼠标放到表格上，显示的字符串进行重组
    // 格式为：风险评级：XXX 个人客户稳健型以下、普通机构客户积极型以下不予授予交易权限
    const valueStr = `${defaultResult1}（${assessResult}）${defaultResult2}`;
    return (
      <div title={valueStr} className={styles.assessItem}>
        {defaultResult1}
        <span>{assessResult}</span>
        <br />
        {defaultResult2}
      </div>
    );
  }

  // 处理评估结果在中间的评估结果
  // 比如： 已通过 (XXX) 学历证明材料
  @autobind
  handleResultByCondMiddle(record) {
    const {
      defaultResult1,
      assessResult,
      defaultResult2,
    } = record;
    // 鼠标放到表格上，显示的字符串进行重组
    // 格式为：模拟交易经历符合（xxx）权限
    const valueStr = `${defaultResult1}（${assessResult}）${defaultResult2}`;
    return (
      <div title={valueStr} className={styles.assessItem}>
        {defaultResult1}（
        <span>{assessResult}</span>
        ）{defaultResult2}
      </div>
    );
  }

  // 返回多个评估结果的处理
  @autobind
  handleResultByMoreCond(record) {
    const {
      defaultResult1,
      aAcctOpenTimeFlagCn,
      defaultResult2,
      rzrqzqAcctFlagCn,
      defaultResult3,
      jrqhjyFlagCn,
    } = record;
    // 鼠标放到表格上，显示的字符串进行重组
    // 格式为：A股账户开立时间6个月以上（XXX）已开立融资融券证券账户（XXX）已提供金融期货交易证明（XXX）
    const valueStr = `${defaultResult1}（${aAcctOpenTimeFlagCn}）${defaultResult2}（${rzrqzqAcctFlagCn}）${defaultResult3}（${jrqhjyFlagCn}）`;
    return (
      <div title={valueStr} className={styles.assessItem}>
        {defaultResult1}（
        <span>{aAcctOpenTimeFlagCn}</span>
        ）
        <br />
        {defaultResult2}（
        <span>{rzrqzqAcctFlagCn}</span>
        ）
        <br />
        {defaultResult3}（
        <span>{jrqhjyFlagCn}</span>
        ）
        <br />
      </div>
    );
  }

  @autobind
  renderTableColumn() {
    const {
      stockCustType,
      reqType,
    } = this.props.data;
    const assessEleColumn = {
      title: '评估要素',
      dataIndex: 'assessEle',
      key: 'assessEle',
      width: '20%',
      render: (value) => {
        const obj = {
          children: (<div title={value} className={styles.assessItem}>
            {value}</div>),
          props: {},
        };
        return obj;
      },
    };
    const aptitudeEleColumn = {
      title: '资质要素',
      dataIndex: 'aptitudeEle',
      key: 'aptitudeEle',
      width: '50%',
      render: (value) => {
        const obj = {
          children: (<div title={value} className={styles.assessItem}>
            {value}</div>),
          props: {},
        };
        return obj;
      },
    };
    const assessResultColumn = {
      title: '评估结果',
      dataIndex: 'assessResult',
      key: 'assessResult',
      width: '30%',
    };
    const defaultColumns = {
      assessEleColumn,
      aptitudeEleColumn,
      assessResultColumn,
    };
    let columns = [];
    // 客户类型是新开客户和申请类型是初次申请的TableColumn
    if (stockCustType === 'New' && reqType === 'New') {
      columns = this.handleColumnTypeIsNew(defaultColumns);
    } else if (stockCustType === 'New' && reqType !== 'New') { // 客户类型是新开客户和申请类型是投资级别变更申请的TableColumn
      columns = this.handleColumncustTypeIsNew(defaultColumns);
    } else if (stockCustType !== 'New') { // 客户类型是多开客户的TableColumn
      columns = this.handleColumnTypeIsMore(defaultColumns);
    }
    return columns;
  }

  renderTableData() {
    const {
      stockCustType,
      reqType,
      assessment: {
        creditOpFlag, // 诚信评估结果
        riskOp, // 风险评级
        riskOptTime, // 风险评级时间
        riskOptTimeFlag, // 风险评级结果
        ageFlagCn, // 年龄条件
        degreeFlagCn,  // 学历
        invFlagCn, // 关联A股账户在我公司开户6个月以上并具备融资融券业务资格
        aAcctOpenTimeFlagCn, // A股开立时间6个月以上
        rzrqzqAcctFlagCn, // 已开立融资融券证券账号
        jrqhjyFlagCn, // 已提供金融期货交易证明
        mTransLevel, // 交易级别
      },
    } = this.props.data;

    const { stockOptionApply: { assessTable } } = config;
    // 诚信评估数据
    const creditOpData = {
      key: '0',
      assessEle: assessTable[0].assessEle,
      aptitudeEle: assessTable[0].aptitudeEle,
      defaultResult: assessTable[0].assessResult,
      assessResult: creditOpFlag,
    };
    // 风险评估数据
    const riskOpData = {
      key: '1',
      assessEle: assessTable[1].assessEle,
      aptitudeEle: assessTable[1].aptitudeEle,
      defaultResult1: assessTable[1].riskGrade,
      assessResult: riskOp,
      defaultResult2: assessTable[1].assessResult,
    };
    // 风险评级时间数据
    const riskOptTimeData = {
      key: '2',
      assessEle: assessTable[2].assessEle,
      aptitudeEle: riskOptTime && riskOptTime.slice(0, 10),
      defaultResult: assessTable[2].assessResult,
      assessResult: riskOptTimeFlag,
    };
    // 基本情况（二选一）年龄数据
    const basicAgeData = {
      key: '3',
      assessEle: assessTable[3].assessEle,
      aptitudeEle: assessTable[3].aptitudeEleAge,
      defaultResult: assessTable[3].assessResultAge,
      assessResult: ageFlagCn,
    };
    // 基本情况（二选一）学历数据
    const basicDegreeData = {
      key: '4',
      assessEle: assessTable[3].assessEle,
      aptitudeEle: assessTable[3].aptitudeEleDegree,
      defaultResult1: assessTable[3].assessResultDegree1,
      assessResult: degreeFlagCn,
      defaultResult2: assessTable[3].assessResultDegree2,
    };
    // 关联A股账户在我公司开户6个月以上并具备融资融券业务资格数据
    const invData = {
      key: '5',
      assessEle: assessTable[4].assessEle,
      aptitudeEle: assessTable[4].aptitudeEleInv,
      defaultResult: assessTable[4].assessResultInv,
      assessResult: invFlagCn,
    };
    // 投资经历评估数据
    const experData = {
      key: '6',
      assessEle: assessTable[4].assessEle,
      aptitudeEle: assessTable[4].aptitudeEleExper,
      defaultResult1: assessTable[4].assessResultaAcct,
      aAcctOpenTimeFlagCn,
      defaultResult2: assessTable[4].assessResultrzrqzq,
      rzrqzqAcctFlagCn,
      defaultResult3: assessTable[4].assessResultjrqhjy,
      jrqhjyFlagCn,
    };
    // 交易级别数据
    const mTransData = {
      key: '7',
      assessEle: assessTable[5].assessEle,
      aptitudeEle: assessTable[5].aptitudeEle,
      defaultResult1: assessTable[5].assessResult1,
      assessResult: mTransLevel,
      defaultResult2: assessTable[5].assessResult2,
    };
    let dataSource = [];
    // 新开客户初次申请
    if (stockCustType === 'New' && reqType === 'New') {
      dataSource = [
        creditOpData,
        riskOpData,
        riskOptTimeData,
        basicAgeData,
        basicDegreeData,
        invData,
        experData,
        mTransData,
      ];
    } else if (stockCustType === 'New' && reqType !== 'New') { // 新开客户投资级别变更申请
      dataSource = [
        creditOpData,
        riskOpData,
        basicAgeData,
        basicDegreeData,
        mTransData,
      ];
    } else if (stockCustType !== 'New') { // 多开客户申请
      dataSource = [
        riskOpData,
        riskOptTimeData,
      ];
    }
    return dataSource;
  }
  render() {
    return (
      <div className={styles.assessTableBox}>
        <Table
          columns={this.renderTableColumn()}
          dataSource={this.renderTableData()}
          bordered
          pagination={false}
        />
      </div>
    );
  }
}
