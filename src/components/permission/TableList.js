import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './tablelist.less';

export default class TableList extends PureComponent {
  static propTypes = {
    info: PropTypes.array.isRequired,
    statusType: PropTypes.string.isRequired,
    selectValue: PropTypes.object,
    emitUpdateValue: PropTypes.func,
  }

  static defaultProps = {
    emitUpdateValue: null,
    selectValue: {},
  }

  get getEleList() {
    const { statusType, emitUpdateValue, selectValue } = this.props;
    const result = this.props.info.map((item) => {
      const callBack = () => {
        emitUpdateValue(item);
      };
      return (
        <li
          key={item.ptyMngId}
          className={style.spServerPersonelItem}
        >
          <div
            className={classnames(['text-center',
              { 'flex-base_0': statusType === 'ready' },
              { 'flex-base_1': statusType !== 'ready' },
            ])}
          >
            <label
              htmlFor={`radio-${item.ptyMngId}`}
              className={
                item.ptyMngId === selectValue.ptyMngId
                ? 'label-btn-circle checked'
                : 'label-btn-circle'
              }
            >&nbsp;</label>
            <input
              type="radio"
              id={`radio-${item.ptyMngId}`}
              name="serverPersonel"
              className="hide"
              checked={item.ptyMngId === selectValue.ptyMngId}
              onChange={callBack}
            />
          </div>
          <span
            className="flex-base_2 text-center"
          >{item.ptyMngId}</span>
          <span
            className="flex-base_2 text-center"
          >
            <span
              className={item.isMain ? style.mainManager : ''}
            >{item.ptyMngName}</span>
          </span>
          <span
            className="flex-base_2 text-center"
          >{item.job}</span>
          <span
            className="flex-base_3 text-center"
          >{item.businessDepartment}</span>
        </li>
      );
    });
    return result;
  }

  render() {
    return (
      <ul className={style.spServerPersonel}>
        <li
          className={classnames([style.spServerPersonelItem, style.firstItem])}
        >
          <span
            className={classnames(['text-center',
              { 'flex-base_0': this.props.statusType === 'ready' },
              { 'flex-base_1': this.props.statusType !== 'ready' },
            ])}
          />
          <span
            className="flex-base_2 text-center"
          >工号</span>
          <span
            className="flex-base_2 text-center"
          >姓名</span>
          <span
            className="flex-base_2 text-center"
          >职位</span>
          <span
            className="flex-base_3 text-center"
          >所属营业部</span>
        </li>
        {this.getEleList}
      </ul>
    );
  }
}
