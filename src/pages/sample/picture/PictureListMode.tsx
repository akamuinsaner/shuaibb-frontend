import React from 'react';
import ListTable, { HeadCell, PageInfo } from 'components/ListTable';
import { state } from './store';
import styles from './index.module.scss';
import { PictureFolder, PictureInfo } from 'declare/picture';
import FolderIcon from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import dayjs from 'dayjs'
import { FolderMenu, PictureMenu } from './ActionMenus';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const headers = ({
    onClickFolder,
    openViewer
}: {
    onClickFolder: (id: any) => void;
    openViewer: (info: PictureInfo) => void;
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
                        else openViewer(record)
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
    onDelete,
    onFolderDelete,
    openRenameDialog,
    openMoveDialog,
    openEditDialog,
    openViewer
}: {
    showFolders: state["folders"];
    pictures: state["pictures"];
    selectedFolders: number[];
    selectedImages: number[];
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    onClickFolder: (id: any) => void
    onDelete: (name: string, id: number) => void;
    onFolderDelete: (name: string, id: number) => void;
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void;
    openViewer: (info: PictureInfo) => void
    openEditDialog: (info: PictureInfo) => void
}) => {
    const allList = [...showFolders, ...pictures];
    const initialPageInfo: PageInfo = { offset: 0, limit: 10, total: allList.length }
    const [pageInfo, setPageInfo] = React.useState<PageInfo>(initialPageInfo)
    const [contextMenu, setContextMenu] = React.useState<{
        type: 'picture' | 'folder';
        record: PictureFolder | PictureInfo;
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const showList = allList.filter((d, i) =>
        i >= pageInfo.offset * pageInfo.limit && i < (pageInfo.offset + 1) * pageInfo.limit)
    React.useEffect(() => setPageInfo(initialPageInfo), [showFolders, pictures]);
    const closeMenu = () => setContextMenu(null);
    const actionHeader: () => HeadCell<PictureFolder & PictureInfo & { action?: any; type?: any }> = React.useCallback(() => {
        return {
            id: 'action',
            label: '操作',
            type: 'string',
            render: (value: any, record: any) => {
                return <>
                    {record.url ?
                        [<Link sx={{ marginRight: '10px' }} onClick={() => openViewer(record)}>查看</Link>,
                        <PictureMenu
                            deleteFuc={() => onDelete(record.name, record.id)}
                            editFunc={() => openEditDialog(record)}
                            renameFunc={() => openRenameDialog(record.name, 'pic', record.id)}
                            moveFunc={() => openMoveDialog({ id: record.id, type: 'pic', parentId: record.folderId })}
                        >
                            <Link>更多</Link>
                        </PictureMenu>] :
                        [<Link
                            sx={{ marginRight: '10px' }}
                            onClick={() => onClickFolder(record.id)}
                        >打开</Link>,
                        <FolderMenu
                            deleteFuc={() => onFolderDelete(record.name, record.id)}
                            renameFunc={() => openRenameDialog(record.name, 'folder', record.id)}
                            moveFunc={() => openMoveDialog({ id: record.id, type: 'folder', parentId: record.parentId })}
                        >
                            <Link>更多</Link>
                        </FolderMenu>]}
                </>
            }
        }
    }, []);
    return (
        <>
            <ListTable<PictureFolder & PictureInfo & { action?: any }>
                headers={[...headers({
                    openViewer,
                    onClickFolder,
                }), actionHeader()]}
                data={showList}
                checkable
                selectedKeys={[
                    ...selectedImages.map(item => `img-${item}`),
                    ...selectedFolders.map(item => `folder-${item}`)
                ]}
                pageInfo={pageInfo}
                rowKey={(record) => record?.url ? `img-${record.id}` : `folder-${record.id}`}
                rowEvents={{
                    onDoubleClick: (e, record) => {
                        e.preventDefault();
                        if (record?.url) openViewer(record)
                        else onClickFolder(record.id)
                    },
                    onContextMenu: (e, record) => {
                        e.preventDefault();
                        setContextMenu(contextMenu === null ? {
                            mouseX: e.clientX + 2,
                            mouseY: e.clientY - 6,
                            record,
                            type: record?.url ? 'picture' : 'folder'
                        } : null);
                    }
                }}
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
            <Menu
                open={contextMenu && contextMenu.type === 'picture'}
                onClose={closeMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    onDelete(contextMenu.record.name, contextMenu.record.id)
                    closeMenu()
                }}>删除</MenuItem>
                <MenuItem onClick={() => {
                    openEditDialog(contextMenu.record)
                }}>编辑</MenuItem>
                <MenuItem onClick={() => {
                    openRenameDialog(contextMenu.record.name, 'pic', contextMenu.record.id)
                }}>重命名</MenuItem>
                <MenuItem onClick={() => {
                    openMoveDialog({ id: contextMenu.record.id, type: 'pic', parentId: (contextMenu.record as any).folderId })
                }}>移动</MenuItem>
            </Menu>
            <Menu
                open={contextMenu && contextMenu.type === 'folder'}
                onClose={closeMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    onFolderDelete(contextMenu.record.name, contextMenu.record.id)
                }}>删除</MenuItem>
                <MenuItem onClick={() => {
                    openRenameDialog(contextMenu.record.name, 'folder', contextMenu.record.id)
                }}>重命名</MenuItem>
                <MenuItem onClick={() => {
                    openMoveDialog({ id: contextMenu.record.id, type: 'folder', parentId: (contextMenu.record as any).parentId })
                }}>移动</MenuItem>
            </Menu>
        </>
    )
}

export default React.memo(PictureListMode);
