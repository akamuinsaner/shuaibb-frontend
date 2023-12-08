import React from 'react';
import styles from './index.module.scss';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import Typography from '@mui/material/Typography';
import { PictureFolder, PictureInfo } from 'declare/picture/index';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { state } from './store';
import Checkbox from '@mui/material/Checkbox';
import { FolderMenu, PictureMenu } from './ActionMenus';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { message } from 'components/globalMessage';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const getListStyle = (isDraggingOver: boolean) => ({
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: 'none',
    ...draggableStyle,
});

const PictureGridMode = ({
    pictures = [],
    showFolders = [],
    onClickFolder,
    onDelete,
    selectedFolders,
    selectedImages,
    setSelectedFolders,
    setSelectedImages,
    folderIds,
    updateFolderIds,
    openRenameDialog,
    openMoveDialog,
    openEditDialog,
    openViewer
}: {
    showFolders: state["folders"];
    pictures: state["pictures"];
    onClickFolder: (id: any) => void
    onDelete: (name: string, id: number) => void;
    selectedFolders: number[];
    selectedImages: number[];
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    updateFolderIds: (ids: any[]) => void;
    folderIds: state["folderIds"];
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void;
    openEditDialog: (info: PictureInfo) => void;
    openViewer: (info: PictureInfo) => void
}) => {
    const onDragEnd = React.useCallback((result: DropResult) => {
        if (!result.destination) {
            return;
        }
        console.log(result)
    }, [])
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided: any, snapshot: any) => (
                    <Grid
                        container
                        spacing={2}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                    >
                        {folderIds.length >= 3 ? <Grid
                            item
                            xs={2}
                            className={`${styles.showItem} ${styles.folderItem}`}
                            sx={{ marginBottom: '40px' }}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <Box className={styles.showItemBox}>
                                <div onDoubleClick={() => {
                                    const copiedFolderIds = [...folderIds];
                                    copiedFolderIds.pop()
                                    updateFolderIds(copiedFolderIds);
                                }}>
                                    <FolderIcon
                                        className={styles.folder}
                                        htmlColor="#FFCF4A"
                                    />
                                </div>
                            </Box>
                            <Typography className={styles.name}>..</Typography>
                        </Grid> : null}
                        {showFolders.map((folder, index) => {
                            return <Draggable
                                key={`folder-${folder.id}`}
                                draggableId={`folder-${folder.id}`}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <Grid
                                        item
                                        xs={2}
                                        key={folder.id}
                                        className={`${styles.showItem} ${styles.folderItem}`}
                                        sx={{ marginBottom: '40px' }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <Box className={styles.showItemBox}>
                                            <Checkbox
                                                className={`
                                       ${styles.checkBox} 
                                       ${selectedFolders.includes(folder.id) ? styles.checked : ''}`}
                                                checked={selectedFolders.includes(folder.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedFolders([...selectedFolders, folder.id])
                                                    } else {
                                                        setSelectedFolders(selectedFolders.filter(item => item !== folder.id))
                                                    }
                                                }}
                                            />
                                            <FolderMenu
                                                deleteFuc={() => onDelete(folder.name, folder.id)}
                                                renameFunc={() => openRenameDialog(folder.name, 'folder', folder.id)}
                                                moveFunc={() => openMoveDialog({ id: folder.id, type: 'folder', parentId: folder.parentId })}
                                                right={true}
                                            >
                                                <div
                                                    onDoubleClick={(e) => onClickFolder(folder.id)}
                                                >
                                                    <FolderIcon
                                                        className={styles.folder}
                                                        htmlColor="#FFCF4A"
                                                    />
                                                </div>
                                            </FolderMenu>

                                        </Box>
                                        <Typography className={styles.name}>{folder.name}</Typography>
                                    </Grid>
                                )}

                            </Draggable>

                        })}
                        {pictures.map((picture, index) => {
                            return <Draggable
                                key={`picture-${picture.id}`}
                                draggableId={`picture-${picture.id}`}
                                index={index + showFolders.length}
                            >
                                {(provided, snapshot) => (
                                    <Grid
                                        item
                                        xs={2}
                                        key={picture.id}
                                        className={`${styles.showItem} ${styles.imgItem}`}
                                        sx={{ marginBottom: '40px' }}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <Box className={styles.showItemBox}>
                                            <Checkbox
                                                className={`
                                                ${styles.checkBox} 
                                                ${selectedImages.includes(picture.id) ? styles.checked : ''}`}
                                                checked={selectedImages.includes(picture.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedImages([...selectedImages, picture.id])
                                                    } else {
                                                        setSelectedImages(selectedImages.filter(item => item !== picture.id))
                                                    }
                                                }}
                                            />
                                            <PictureMenu
                                                deleteFuc={() => onDelete(picture.name, picture.id)}
                                                editFunc={() => openEditDialog(picture)}
                                                renameFunc={() => openRenameDialog(picture.name, 'pic', picture.id)}
                                                moveFunc={() => openMoveDialog({ id: picture.id, type: 'pic', parentId: picture.folderId })}
                                                right={true}
                                            >
                                                <img
                                                    src={picture.url}
                                                    onDoubleClick={() => openViewer(picture)}
                                                />
                                            </PictureMenu>
                                            <Box className={styles.btmActions}>
                                                <Tooltip title="删除图片">
                                                    <DeleteOutlineIcon
                                                        htmlColor='#fff'
                                                        onClick={() => onDelete(picture.name, picture.id)}
                                                    />
                                                </Tooltip>
                                                <Tooltip title="复制地址">
                                                    <ContentCopyIcon
                                                        htmlColor='#fff'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(picture.url);
                                                            message.success('复制成功');
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Tooltip title="复制图片代码">
                                                    <CopyAllIcon
                                                        htmlColor='#fff'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`<img src=${picture.url} />`);
                                                            message.success('复制成功');
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        <Typography className={styles.name}>{picture.name}</Typography>
                                    </Grid>
                                )}
                            </Draggable>
                        })}
                        {provided.placeholder}
                    </Grid>
                )}
            </Droppable>
        </DragDropContext>

    )
}

export default React.memo(PictureGridMode);