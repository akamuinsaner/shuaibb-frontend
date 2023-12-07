import React from 'react';
import ListTable, { HeadCell, PageInfo } from 'components/ListTable';
import { state } from './store';
import styles from './index.module.scss';
import { PictureFolder, PictureInfo } from 'declare/picture';
import FolderIcon from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import dayjs from 'dayjs'
import { Button } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


const headers = ({
    onClickFolder,
    folderIds,
    updateFolderIds
}: {
    onClickFolder: (id: any) => void;
    updateFolderIds: (ids: any[]) => void;
    folderIds: state["folderIds"];
}): HeadCell<PictureFolder & PictureInfo & { action?: any; type?: any }>[] => [
        {
            id: 'name',
            label: '文件',
            type: 'string',
            render: (value, record) => {
                return <Box className={styles.nameCell}>
                    {record?.url ? <img src={record.url} /> : <FolderIcon />}
                    <Link onClick={() => {
                        if (!record?.url) onClickFolder(record.id)
                    }}>{value}</Link>
                </Box>
            }
        },
        {
            id: 'size',
            label: '大小',
            type: 'string',
            render: (value) => {
                return value ? `${parseInt(`${value / 1024}`)}KB` : '-'
            }
        },
        {
            id: 'width',
            label: '尺寸',
            type: 'string',
            render: (value, record) => {
                return value ? `${record?.width}*${record?.height}` : '-'
            }
        },
        {
            id: 'updatedAt',
            label: '更新时间',
            type: 'string',
            render: (value) => {
                return dayjs(value).format('YYYY-MM-DD HH:MM:ss')
            }
        },

    ]

const PictureListMode = ({
    pictures = [],
    showFolders = [],
    selectedFolders,
    selectedImages,
    setSelectedFolders,
    setSelectedImages,
    onClickFolder,
    folderIds,
    updateFolderIds,
    onDelete,
    onFolderDelete,
    openRenameDialog,
    openMoveDialog
}: {
    showFolders: state["folders"];
    pictures: state["pictures"];
    selectedFolders: number[];
    selectedImages: number[];
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    onClickFolder: (id: any) => void
    updateFolderIds: (ids: any[]) => void;
    folderIds: state["folderIds"];
    onDelete: (name: string, id: number) => void;
    onFolderDelete: (name: string, id: number) => void;
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void
}) => {
    const allList = [...showFolders, ...pictures];
    const initialPageInfo: PageInfo = { offset: 0, limit: 10, total: allList.length }
    const [pageInfo, setPageInfo] = React.useState<PageInfo>(initialPageInfo)
    const showList = allList.filter((d, i) =>
        i >= pageInfo.offset * pageInfo.limit && i < (pageInfo.offset + 1) * pageInfo.limit)
    React.useEffect(() => setPageInfo(initialPageInfo), [showFolders, pictures]);
    const actionHeader: () => HeadCell<PictureFolder & PictureInfo & { action?: any; type?: any }> = React.useCallback(() => {
        return {
            id: 'action',
            label: '操作',
            type: 'string',
            render: (value: any, record: any) => {
                return <>
                    {record.url ?
                        [<Link sx={{ marginRight: '10px' }}>查看</Link>,
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState: any) => (
                                <React.Fragment>
                                    <Link {...bindTrigger(popupState)}>
                                        更多
                                    </Link>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            onDelete(record.name, record.id)
                                            popupState.close()
                                        }}>删除</MenuItem>
                                        <MenuItem>编辑</MenuItem>
                                        <MenuItem onClick={() => {
                                            openRenameDialog(record.name, 'pic', record.id)
                                            popupState.close()
                                        }}>重命名</MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                openMoveDialog({ id: record.id, type: 'pic', parentId: record.folderId })
                                                popupState.close()
                                            }}
                                        >移动</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>] :
                        [<Link
                            sx={{ marginRight: '10px' }}
                            onClick={() => onClickFolder(record.id)}
                        >打开</Link>,
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState: any) => (
                                <React.Fragment>
                                    <Link {...bindTrigger(popupState)}>
                                        更多
                                    </Link>
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={() => {
                                            onFolderDelete(record.name, record.id)
                                            popupState.close()
                                        }}>删除</MenuItem>
                                        <MenuItem onClick={() => {
                                            openRenameDialog(record.name, 'folder', record.id)
                                            popupState.close()
                                        }}>重命名</MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                openMoveDialog({ id: record.id, type: 'folder', parentId: record.parentId })
                                                popupState.close()
                                            }}
                                        >移动</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>]}
                </>
            }
        }
    }, []);
    return (
        <ListTable<PictureFolder & PictureInfo & { action?: any }>
            headers={[...headers({
                onClickFolder,
                folderIds,
                updateFolderIds
            }), actionHeader()]}
            data={showList}
            checkable
            selectedKeys={[
                ...selectedImages.map(item => `img-${item}`),
                ...selectedFolders.map(item => `folder-${item}`)
            ]}
            pageInfo={pageInfo}
            rowKey={(record) => record?.url ? `img-${record.id}` : `folder-${record.id}`}
            onChange={(params) => {
                setPageInfo({ ...pageInfo, offset: params.offset })
            }}
            onSelectRows={(selectKeys: string[]) => {
                const imgKeys = selectKeys
                    .filter(item => item.startsWith('img'))
                    .map(item => Number(item.replace('img-', '')));
                const folderKeys = selectKeys
                    .filter(item => item.startsWith('folder'))
                    .map(item => Number(item.replace('folder-', '')));
                setSelectedImages(imgKeys)
                setSelectedFolders(folderKeys);
            }}
        />
    )
}

export default React.memo(PictureListMode);
