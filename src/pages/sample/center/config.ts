import type { SampleData, SampleLabel } from 'declare/sample';
import type { HeadCell } from 'components/ListTable';


export const headCells: HeadCell<SampleData>[] = [
  {
    id: 'name',
    type: 'string',
    label: '样片名称',
  },
  {
    id: 'tags',
    type: 'array',
    label: '标签',
    render: (value, record, index) => {
      return value.map((item: SampleLabel) => item.name).join(',')
    }
  },
  {
    id: 'desc',
    type: 'string',
    label: '样片描述',
  },
  {
    id: 'price',
    type: 'number',
    label: '价格',
  },
  {
    id: 'deposit',
    type: 'number',
    label: '定金',
  },
  {
    id: 'costumeOffer',
    type: 'boolean',
    label: '妆造',
    render: (value, record, index) => {
      return value ? '提供' : '不提供'
    }
  },
  {
    id: 'costumeCount',
    type: 'number',
    label: '服装套数',
    render: (value, record, index) => {
      return record?.customCostumeCount ? record?.customCostumeCount : record.costumeCount
    }
  },
  {
    id: 'negativeFilmCount',
    type: 'number',
    label: '底片数量',
  },
  {
    id: 'negaFilmAllOffer',
    type: 'boolean',
    label: '底片全送',
    render: (value, record, index) => {
      return value ? '是' : '否'
    }
  },
  {
    id: 'shootingTime',
    type: 'number',
    label: '拍摄时长',
    render: (value, record, index) => {
      return record?.customShootingTime ? record?.customShootingTime : record.shootingTime
    }
  },
  {
    id: 'refineCount',
    type: 'number',
    label: '精修数量',
  },
  {
    id: 'shootingIndoor',
    type: 'boolean',
    label: '拍摄场景',
    render: (value, record, index) => {
      return value ? '内景' : '外景'
    }
  },
  {
    id: 'shootingSceneIndoorCount',
    type: 'number',
    label: '内景数量',
    render: (value, record, index) => {
      return record.shootingIndoor ? record.shootingSceneIndoorCount : 0
    }
  }
];