import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Input, Popconfirm, message } from 'antd';
import _ from 'lodash';
import Button from '../common/Button';
import Icon from '../common/Icon';
import DropdownSelect from '../common/dropdownSelect';
// import CommonTable from '../common/biz/CommonTable';
import styles from './newDevelopTeam.less';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    // 可添加新开发团队的服务经理
    addEmpList: PropTypes.array.isRequired,
    getAddEmpList: PropTypes.func.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新开发团队人员信息
      serverInfo: [],
      // 选中作为 添加项 添加到table列表中
      addSelectedValue: {},
    };
  }
  componentWillMount() {
    this.setState({ serverInfo: this.props.data });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data !== this.props.data) {
      this.setState({ serverInfo: newProps.data });
    }
    // if (!_.isEqual(this.props.custId, newProps.custId)) {
    //   this.setState({ serverInfo: [] });
    // }
  }

  // 添加新开发经理人员按钮
  @autobind
  onAddServerPerson() {
    // 新开发经理不能重复添加
    if (_.isEmpty(_.find(this.state.serverInfo, this.state.addSelectedValue))) {
      if (!_.isEmpty(this.state.addSelectedValue)) {
        this.setState(prevState => ({
          serverInfo: _.concat(prevState.serverInfo, this.state.addSelectedValue),
        }), () => {
          this.props.onEmitEvent(this.props.type, this.state.serverInfo);
        });
      }
    } else {
      message.error('新开发经理不能重复添加');
    }
  }

  // 权重改变
  @autobind
  handleChangeWeight(empId, dataIndex, value) {
    if (!_.isNumber(Number(value)) || value <= 0 || value > 100) {
      message.error('您输入的权重值为0到100的数值，可以为100，但是不能为0');
    } else {
      const dataSource = [...this.state.serverInfo];
      const target = dataSource.find(item => item.empId === empId);
      console.warn('target', target);
      if (target) {
        console.warn('value', value);
        target[dataIndex] = value;
        this.setState({ serverInfo: dataSource }, () => {
          console.warn('this.state.serverInfo', this.state.serverInfo);
        });
      }
    }
  }

  // 移除新开发经理人员按钮
  @autobind
  onDeleteServerPerson(empId) {
    const serverInfo = [...this.state.serverInfo];
    this.setState({
      serverInfo: serverInfo.filter(item => item.empId !== empId),
    });
  }

  // 下拉菜单添加选中对象
  @autobind
  dropdownSelectedItem(item) {
    this.setState({ addSelectedValue: { ...item } });
  }

  // 下拉菜单搜错查询关键字
  @autobind
  dropdownToSearchInfo(value) {
    this.props.getAddEmpList(value);
  }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [
      {
        dataIndex: 'empId',
        key: 'empId',
        title: '工号',
      },
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '姓名',
      },
      {
        dataIndex: 'orgName',
        key: 'orgName',
        title: '部门',
      },
      {
        dataIndex: 'postnName',
        key: 'poatnName',
        title: '职位',
      },
      {
        dataIndex: 'weight',
        key: 'weight',
        title: '权重',
        render: (text, record) => {
          console.warn('text', text);
          return (
            <Input
              value={text}
              onChange={e => this.handleChangeWeight(record.empId, 'weight', e.target.value)}
            />
          );
        },
      },
      {
        dataIndex: 'isRugang',
        key: 'isRugang',
        title: '是否入岗投顾',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <Popconfirm title="确定删除该开发经理?" onConfirm={() => this.onDeleteServerPerson(record.empId)}>
            <Icon type="shanchu" />
          </Popconfirm>
          ),
      },
    ];
    return columns;
  }

  render() {
    const {
      addEmpList,
    } = this.props;
    const columns = this.constructTableColumns();
    return (
      <div className={styles.newDevelopTeam}>
        <div className={styles.addDevelopTeam}>
          <div className={styles.spAddDropdownSelect}>
            <DropdownSelect
              value="工号/名称"
              placeholder="请输入姓名或工号"
              searchList={addEmpList}
              showObjKey="empName"
              objId="empId"
              emitSelectItem={this.dropdownSelectedItem}
              emitToSearch={this.dropdownToSearchInfo}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
          {
            !_.isEmpty(this.state.addSelectedValue) ?
              <Button
                type="primary"
                onClick={this.onAddServerPerson}
                className={styles.spAddBtn}
              >
              添加
            </Button>
            :
              <Button
                type="primary"
                disabled
                className={styles.spAddBtn}
              >
              添加
            </Button>
          }
        </div>
        <Table
          className={styles.newTeamTable}
          dataSource={this.state.serverInfo}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}
