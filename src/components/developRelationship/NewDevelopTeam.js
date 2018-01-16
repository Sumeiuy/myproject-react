import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Popconfirm, message, InputNumber } from 'antd';
import _ from 'lodash';
import Button from '../common/Button';
import Icon from '../common/Icon';
import DropdownSelect from '../common/dropdownSelect';
import commonHelpr from './developRelationshipHelpr';
import styles from './newDevelopTeam.less';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    // 可添加新开发团队的服务经理
    addEmpList: PropTypes.array.isRequired,
    getAddEmpList: PropTypes.func.isRequired,
    onChangeNewDevelopTeam: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    custId: PropTypes.string,
  }

  static defaultProps = {
    data: [],
    custId: '',
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
    if (!_.isEmpty(this.props.custId) && !_.isEqual(this.props.custId, newProps.custId)) {
      this.setState({ serverInfo: [] });
    }
  }

  // 添加新开发经理人员按钮
  @autobind
  onAddServerPerson() {
    const { serverInfo, addSelectedValue } = this.state;
    // 新开发经理不能重复添加
    const exist = _.findIndex(serverInfo, o => o.activeLogin === addSelectedValue.activeLogin) > -1;
    if (!exist) {
      if (!_.isEmpty(this.state.addSelectedValue)) {
        this.setState(prevState => ({
          serverInfo: _.concat(prevState.serverInfo, this.state.addSelectedValue),
        }), () => {
          this.props.onChangeNewDevelopTeam(this.props.type, this.state.serverInfo);
        });
      }
    } else {
      message.error('新开发经理不能重复添加');
    }
  }

  // 移除新开发经理人员按钮
  @autobind
  onDeleteServerPerson(activeLogin) {
    const serverInfo = [...this.state.serverInfo];
    this.setState({
      serverInfo: serverInfo.filter(item => item.activeLogin !== activeLogin),
    }, () => {
      this.props.onChangeNewDevelopTeam(this.props.type, this.state.serverInfo);
    });
  }

  // 权重改变
  @autobind
  handleChangeWeight(value, activeLogin) {
    const reg = /^(([1-9]\d?)|100)$/;
    if (!reg.test(Number(value))) {
      message.error('您输入的权重值为1到100的数值');
    }
    const dataSource = [...this.state.serverInfo];
    const target = dataSource.find(item => item.activeLogin === activeLogin);
    if (target) {
      target.weigh = value;
      this.setState({ serverInfo: dataSource });
    }
  }

  // 下拉菜单添加选中对象
  @autobind
  dropdownSelectedItem(item) {
    this.setState({ addSelectedValue: { ...item } });
  }

  // 下拉菜单搜错查询关键字
  @autobind
  dropdownToSearchInfo(value) {
    this.props.getAddEmpList({ keyword: value });
  }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [
      {
        dataIndex: 'activeLogin',
        key: 'activeLogin',
        title: '工号',
      },
      {
        dataIndex: 'activeLastName',
        key: 'activeLastName',
        title: '姓名',
      },
      {
        dataIndex: 'deptName',
        key: 'deptName',
        title: '部门',
      },
      {
        dataIndex: 'positionName',
        key: 'positionName',
        title: '职位',
      },
      {
        dataIndex: 'weigh',
        key: 'weigh',
        title: '权重',
        render: (text, record) =>
          (
            <InputNumber
              min={1}
              max={100}
              value={text}
              onChange={v => this.handleChangeWeight(v, record.activeLogin)}
            />
        ),
      },
      {
        dataIndex: 'tgFlag',
        key: 'tgFlag',
        title: '是否入岗投顾',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <Popconfirm title="确定删除该开发经理?" onConfirm={() => this.onDeleteServerPerson(record.activeLogin)}>
            <Icon type="shanchu" />
          </Popconfirm>
          ),
      },
    ];
    return columns;
  }

  render() {
    const { addEmpList } = this.props;
    const { serverInfo } = this.state;
    const newServerInfo = commonHelpr.convertTgFlag(serverInfo, true);
    const columns = this.constructTableColumns();
    return (
      <div className={styles.newDevelopTeam}>
        <div className={styles.addDevelopTeam}>
          <div className={styles.spAddDropdownSelect}>
            <DropdownSelect
              value="工号/名称"
              placeholder="请输入姓名或工号"
              searchList={addEmpList}
              showObjKey="activeLastName"
              objId="activeLogin"
              emitSelectItem={this.dropdownSelectedItem}
              emitToSearch={this.dropdownToSearchInfo}
              boxStyle={{ border: '1px solid #d9d9d9' }}
              getPopupContainer={() => document.body}
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
          dataSource={newServerInfo}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>
    );
  }
}
