// 从首页搜索框的热点标签、普通标签、即时搜索联想词标签、任务中心瞄准镜标签
// 发起任务时，需要将标签信息进行构造，带入任务提示

/**
 * 根据标签类型，获取任务提示的内容，瞄准镜用变量替换，不是瞄准镜用普通任务提示
 * @param {*bool} sightingScopeBool 是否来自瞄准镜
 * @param {*string} labelId 标签id
 * @param {*string} labelName 标签名字
 */
export default function padMissionDesc(sightingScopeBool, labelId, labelName) {
  // 来自普通标签
  let missionDesc = encodeURIComponent(`该客户筛选自${labelName}`);
  // 来自瞄准镜标签
  if (sightingScopeBool) {
    missionDesc = encodeURIComponent(`该客户筛选自 $瞄准镜标签#${labelId}# `);
  }

  return missionDesc;
}
