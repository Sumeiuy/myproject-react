/**
 * @author sunweibin
 * @description 用来存放图表Tooltip的配置项
 */

// 堆叠柱状图的Tooltip配置
const stackTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'shadow',
  },
  backgroundColor: 'rgba(0, 0, 0, .56)',
  padding: [12, 11, 13, 13],
  extraCssText: 'border-radius: 8px;',
  position(pos, params, dom, rect, size) {
    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    const obj = {};
    obj.top = pos[1] - size.contentSize[1];
    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
    return obj;
  },
};

export default { stackTooltip };
