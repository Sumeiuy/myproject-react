/*
 * @Author: zhangjun
 * @Date: 2018-04-24 14:14:04
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-04-24 17:43:21
 * @Descripter:投资建议模板 Home页面
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Button, Collapse, Icon } from 'antd';
import styles from './home.less';

const Panel = Collapse.Panel;

export default class InvestmentAdvice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否显示弹层
      showModal: false,
      // 折叠面板打开的id
      collapseActiveKey: '',
      // 投资列表
      investmentList: [{
        key: 1,
        id: 1,
        type: '产品销售类',
        title: '标题内容标题内容标题内容标题内容',
        content: '紫金产品赎回提醒-业绩比较基准内容内容内容内容…',
        panel: '紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容',
        operate: '',
      }, {
        key: 2,
        id: 2,
        type: '产品销售类',
        title: '标题内容标题内容标题内容标题内容',
        content: '紫金产品赎回提醒-业绩比较基准内容内容内容内容…',
        panel: '紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容',
        operate: '',
      }, {
        key: 3,
        id: 3,
        type: '产品销售类',
        title: '标题内容标题内容标题内容标题内容',
        content: '紫金产品赎回提醒-业绩比较基准内容内容内容内容…',
        panel: '紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容',
        operate: '',
      }, {
        key: 4,
        id: 4,
        type: '产品销售类',
        title: '标题内容标题内容标题内容标题内容',
        content: '紫金产品赎回提醒-业绩比较基准内容内容内容内容…',
        panel: '紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容紫金产品赎回提醒-业绩比较基准内容内容内容内容内容内容内容内容内容内内容内容内容内容内容内容容',
        operate: '',
      }],
    };
  }
  // 切换折叠面板
  @autobind
  handleChangeCollapse(collapseActiveKey) {
    this.setState({ collapseActiveKey });
  }

  // 删除投资建议
  // deleteConfirm(id, e) {
  //   if (e) {
  //     e.PreventDefault();
  //   }
  // }

  render() {
    const { collapseActiveKey } = this.state;
    const collapseProps = {
      activeKey: collapseActiveKey,
      onChange: this.handleChangeCollapse,
      accordion: true,
    };
    const investmentList = this.state.investmentList.map((item) => {
      const header = (<div className={styles.collapseHead}>
        <span className={styles.type}>{item.type}</span>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.content}>{item.content}<Icon type="up" /><Icon type="down" /></span>
        <span className={styles.operate} >
          <Icon type="delete" onClick={e => this.deleteConfirm(item.id, e)} />
        </span>
      </div>);
      return (
        <Panel header={header} key={item.key}>
          <div className={styles.collapsePanel}>
            <p>{item.panel}</p>
            <Button>编辑</Button>
          </div>
        </Panel>
      );
    });
    return (
      <div className={styles.investmentAdviceWrapper}>
        <div className={styles.tipsBox}>
          <p>请在此定义投顾可以选择的投资建议固定话术。</p>
          <Button type="primary" icon="plus">模板</Button>
        </div>
        <div className={styles.collapseBox}>
          <div className={styles.head}>
            <span className={styles.type}>类型</span>
            <span className={styles.title}>标题</span>
            <span className={styles.content}>内容</span>
            <span className={styles.operate}>操作</span>
          </div>
          <Collapse {...collapseProps}>{investmentList}</Collapse>
        </div>
      </div>
    );
  }
}
