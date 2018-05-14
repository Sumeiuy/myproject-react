import React from 'react';
import TreeSelect from './Select';

import './index.less';


export default function HtTreeSelect(props) {
  const SHOW_PARENT = 'SHOW_PARENT';
  let elem = null;

  const handleClickClose = () => {
    elem.style.display = 'none';
    this.props.onClose();
  };
  return (
    <div className="ht-tree-select" ref={ref => elem = ref}>
      <TreeSelect
        transitionName="ht-dropdown-slide-up"
        choiceTransitionName="ht-selection__choice-zoom"
        treeNodeFilterProp="title"
        treeCheckable
        searchPlaceholder="搜索"
        showCheckedStrategy={SHOW_PARENT}
        {...props}
      />
      <div
        style={props.isCloseable ? {} : { display: 'none' }}
        className={'ht-closeIcon ht-iconfont ht-icon-guanbi1'}
        onClick={handleClickClose}
      />
    </div>
  );
}
