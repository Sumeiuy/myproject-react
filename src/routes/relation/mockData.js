export const treeArray = [{
  id: 'njfgs',
  name: '南京分公司',
  category: 'company',
  children: [{
    id: '1',
    name: '财富中心1',
    category: 'center',
    children: [{
      id: '1',
      name: '张三团队',
      category: 'team',
    }, {
      id: '2',
      name: '李四团队',
      category: 'team',
    }],
  }, {
    id: '2',
    name: '财富中心2',
    category: 'center',
    children: [{
      id: '3',
      name: '马六团队',
      category: 'team',
    }, {
      id: '4',
      name: '玄武团队',
      category: 'team',
    }],
  }, {
    id: '3',
    name: '财富中心3',
    category: 'center',
    children: [{
      id: '5',
      name: '李逵团队',
      category: 'team',
    }, {
      id: '6',
      name: '镇江团队',
      category: 'team',
    }],
  }],
}];

export const managerArray = [{
  name: '张三', code: '0987689',
}, {
  name: '李四', code: '09856789',
}];

export const companyArray = [{
  id: '1',
  title: '财富中心1',
  manager: '张三',
  teamNum: '10',
  adviserNum: '1000',
}, {
  id: '2',
  title: '财富中心2',
  manager: '张三',
  teamNum: '23',
  adviserNum: '1000',
}, {
  id: '3',
  title: '财富中心3',
  manager: '张三',
  teamNum: '12',
  adviserNum: '1000',
}];

export const centerArray = [{
  id: '1',
  title: '张三团队',
  manager: '张三',
  adviserNum: '10000',
}, {
  id: '2',
  title: '李斯团队',
  manager: '张三',
  adviserNum: '21000',
}, {
  id: '3',
  title: '王二团队',
  manager: '张三',
  adviserNum: '12000',
}];

export const teamArray = [{
  id: '1',
  code: 'HTSC001234',
  name: '王某某',
}, {
  id: '2',
  code: 'HTSC001234',
  name: '王某某',
}, {
  id: '3',
  code: 'HTSC001234',
  name: '王某某',
}];
