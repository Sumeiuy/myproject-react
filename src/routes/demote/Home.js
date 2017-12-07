/*
 * @Description: 降级客户处理页面
 * @Author: LiuJianShu
 * @Date: 2017-12-06 14:45:44
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-12-07 16:02:22
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { withRouter } from 'dva-react-router-3/router';
// import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';

import Button from '../../components/common/Button';
import CommonTable from '../../components/common/biz/CommonTable';
import Barable from '../../decorators/selfBar';
import config from './config';
import styles from './home.less';

// const mapStateToProps = state => ({

// });

const mapDispatchToProps = {

};

@connect(mapDispatchToProps)
// @connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Demote extends PureComponent {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 10,
      data: [
        {
          key: '1',
          econNum: '000001',
          custName: '张三',
          checked: true,
        },
        {
          key: '2',
          econNum: '000002',
          custName: '张三',
          checked: true,
        },
        {
          key: '3',
          econNum: '000003',
          custName: '张三',
          checked: true,
        },
        {
          key: '4',
          econNum: '000004',
          custName: '张三',
          checked: true,
        },
        {
          key: '5',
          econNum: '000005',
          custName: '张三',
          checked: true,
        },
        {
          key: '6',
          econNum: '000006',
          custName: '张三',
          checked: true,
        },
        {
          key: '7',
          econNum: '000007',
          custName: '张三',
          checked: true,
        },
        {
          key: '8',
          econNum: '000008',
          custName: '张三',
          checked: true,
        },
        {
          key: '9',
          econNum: '000009',
          custName: '张三',
          checked: true,
        },
        {
          key: '10',
          econNum: '000010',
          custName: '张三',
          checked: true,
        },
        {
          key: '11',
          econNum: '000011',
          custName: '张三',
          checked: true,
        },
        {
          key: '12',
          econNum: '000012',
          custName: '张三',
          checked: true,
        },
        {
          key: '13',
          econNum: '000013',
          custName: '张三',
          checked: true,
        },
        {
          key: '14',
          econNum: '000014',
          custName: '张三',
          checked: true,
        },
        {
          key: '15',
          econNum: '0000015',
          custName: '张三',
          checked: true,
        },
        {
          key: '16',
          econNum: '000016',
          custName: '张三',
          checked: true,
        },
        {
          key: '17',
          econNum: '000017',
          custName: '张三',
          checked: true,
        },
        {
          key: '18',
          econNum: '000018',
          custName: '张三',
          checked: true,
        },
        {
          key: '19',
          econNum: '000019',
          custName: '张三',
          checked: true,
        },
        {
          key: '20',
          econNum: '000020',
          custName: '张三',
          checked: true,
        },
        {
          key: '21',
          econNum: '000021',
          custName: '张三',
          checked: true,
        },
      ],
    };
  }

  @autobind
  onChange(page, pageSize) {
    this.setState({
      currentPage: page,
      pageSize,
    });
  }

  @autobind
  onSubmit() {
    console.warn('点击了提交按钮');
    const { data } = this.state;
    console.warn('data', data);
  }

  @autobind
  deleteTableData(checked, record, index) {
    const { data, currentPage, pageSize } = this.state;
    const newData = [...data];
    const idx = ((currentPage - 1) * pageSize) + index;
    newData[idx] = {
      ...newData[idx],
      checked,
    };
    this.setState({
      data: newData,
    });
  }

  render() {
    const operation = {
      column: {
        key: 'switch',
        title: '是否降级',
      },
      operate: this.deleteTableData,
    };
    const { data } = this.state;
    return (
      <div className={styles.demoteWrapper}>
        <h2 className={styles.title}>
          <span>提醒：</span>
          <span>2018年度，您名下有以下客户将降级划转为零售客户，请确认！<br />
        超过2018年1月6日，未做确认，系统将自动划转！</span>
        </h2>
        <CommonTable
          data={data}
          titleList={config.titleList}
          operation={operation}
          pagination={{
            size: 'small',
            total: data.length,
            defaultPageSize: 10,
            current: this.state.currentPage,
            onChange: this.onChange,
            onShowSizeChange: this.onChange,
            showSizeChanger: true,
          }}
        />
        <div className={styles.btnDiv}>
          <Button
            type="primary"
            onClick={this.onSubmit}
          >
            提交
          </Button>
          <Button>
            取消
          </Button>
        </div>
      </div>
    );
  }
}
