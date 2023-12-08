import React from 'react';
import Paper from '@mui/material/Paper';
import styles from './index.module.scss';
import PictureGridMode from './PictureGridMode';
import PictureListMode from './PictureListMode';
import PictureActions from './PictureActions'
import { state, ESortMethod } from './store';
import RenameDialog from './RenameDialog';
import MoveDialog from './MoveDialog';
import { PictureInfo, PictureFolder } from 'declare/picture';
import { message } from 'components/globalMessage';
import PictureEditDialog from './PictureEditDialog'
import Viewer from 'react-viewer'
import { SampleLabel } from 'declare/sample';
import UploadDialog from './uploadDialog';


type RenameState = {
    id: number;
    open: boolean;
    name: string;
    type: 'pic' | 'folder' 
}

type MoveState = {
    id: number;
    type: 'pic' | 'folder';
    parentId: number
}

type BatchMoveState = {
    parentId?: number;
    folderIds?: number[];
    pictureIds?: number[]
}

const PictureFields = ({
    selectedImages,
    selectedFolders,
    setSelectedFolders,
    setSelectedImages,
    folderIds,
    showMode,
    toogleMode,
    pictures = [],
    onUpload,
    showFolders = [],
    onClickFolder,
    onDelete,
    formatedFolders,
    updateFolderIds,
    openCreateDialog,
    onFolderDelete,
    onPictureUpdate,
    onFolderUpdate,
    folders,
    changeSort,
    sortMethod,
    onSearch,
    isSearching,
    cancelSearch,
    batchDelete,
    batchMove,
    onCover,
    labels,
    curFolderId
}: {
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    selectedImages: number[];
    selectedFolders: number[];
    folderIds: state["folderIds"];
    toogleMode: () => void;
    showMode: state["showMode"];
    showFolders: state["folders"];
    pictures: state["pictures"];
    formatedFolders: state["formatedFolders"];
    onUpload: (data: any) => void
    onClickFolder: (id: any) => void
    onDelete: (name: string, id: number) => void;
    onFolderDelete: (name: string, id: number) => void;
    updateFolderIds: (ids: any[]) => void;
    openCreateDialog: () => void;
    onPictureUpdate: (data: Partial<PictureInfo>) => void;
    onFolderUpdate: (data: Partial<PictureFolder>) => void;
    folders: state["folders"];
    changeSort: (sortMethod: ESortMethod) => void;
    sortMethod: ESortMethod;
    onSearch: (searchState: any) => void;
    isSearching: boolean;
    cancelSearch: () => void;
    batchDelete: (data: any) => void;
    batchMove: (data: any) => void;
    onCover: (data: any) => void;
    labels: SampleLabel[];
    curFolderId: any
}) => {
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState<boolean>(false);
    const [viewPictureInfo, setViewPictureInfo] = React.useState<PictureInfo>(null);
    const [editPictureInfo, setEditPictureInfo] = React.useState<PictureInfo>(null);
    const [renameDialogState, setRenameDialogState] = React.useState<RenameState>({ 
        open: false, name: '', type: 'pic', id: null
    });
    const [moveState, setMoveState] = React.useState<MoveState>({ 
        id: null, type: 'pic', parentId: null
    })
    const [batchMoveState, setBatchMoveState] = React.useState<BatchMoveState>({})

    return (
        <Paper
            elevation={3}
            square={false}
            className={styles.pictureField}
        >
            <PictureActions
                selectedFolders={selectedFolders}
                selectedImages={selectedImages}
                setSelectedFolders={setSelectedFolders}
                setSelectedImages={setSelectedImages}
                pictures={pictures}
                showFolders={showFolders}
                showMode={showMode}
                toogleMode={toogleMode}
                onUpload={onUpload}
                folderIds={folderIds}
                formatedFolders={formatedFolders}
                updateFolderIds={updateFolderIds}
                openCreateDialog={openCreateDialog}
                changeSort={changeSort}
                sortMethod={sortMethod}
                onSearch={onSearch}
                isSearching={isSearching}
                cancelSearch={cancelSearch}
                openRenameDialog={(name:string, type: 'pic' | 'folder', id: number) => setRenameDialogState({
                    name, type, open: true, id
                })}
                openMoveDialog={(data: MoveState) => setMoveState(data)}
                openBatchMoveDialog={(data: BatchMoveState) => setBatchMoveState(data)}
                batchDelete={batchDelete}
                openUploadDialog={() => setUploadDialogOpen(true)}
                openEditDialog={(info: PictureInfo) => setEditPictureInfo(info)}
            />
            {
                showMode === 'grid' ? (
                    <PictureGridMode
                        selectedFolders={selectedFolders}
                        selectedImages={selectedImages}
                        setSelectedFolders={setSelectedFolders}
                        setSelectedImages={setSelectedImages}
                        pictures={pictures}
                        showFolders={showFolders}
                        onClickFolder={onClickFolder}
                        onDelete={onDelete}
                        folderIds={folderIds}
                        updateFolderIds={updateFolderIds}
                        openViewer={(info: PictureInfo) => setViewPictureInfo(info)}
                        openEditDialog={(info: PictureInfo) => setEditPictureInfo(info)}
                        openMoveDialog={(data: MoveState) => setMoveState(data)}
                        openRenameDialog={(name:string, type: 'pic' | 'folder', id: number) => setRenameDialogState({
                            name, type, open: true, id
                        })}
                    />
                ) : (
                    <PictureListMode
                        pictures={pictures}
                        showFolders={showFolders}
                        selectedFolders={selectedFolders}
                        selectedImages={selectedImages}
                        setSelectedFolders={setSelectedFolders}
                        setSelectedImages={setSelectedImages}
                        onClickFolder={onClickFolder}
                        onDelete={onDelete}
                        onFolderDelete={onFolderDelete}
                        openViewer={(info: PictureInfo) => setViewPictureInfo(info)}
                        openEditDialog={(info: PictureInfo) => setEditPictureInfo(info)}
                        openRenameDialog={(name:string, type: 'pic' | 'folder', id: number) => setRenameDialogState({
                            name, type, open: true, id
                        })}
                        openMoveDialog={(data: MoveState) => setMoveState(data)}
                    />
                )
            }
            <RenameDialog
                open={renameDialogState.open}
                close={() => setRenameDialogState({ ...renameDialogState, open: false })}
                defaultName={renameDialogState.name}
                type={renameDialogState.type}
                onSubmit={(name: string) => {
                    if (renameDialogState.type === 'pic') {
                        onPictureUpdate({ name, id: renameDialogState.id });
                    } else {
                        onFolderUpdate({ name, id: renameDialogState.id })
                    }
                    setRenameDialogState({ ...renameDialogState, open: false })
                }}
            />
            <MoveDialog
                open={!!moveState.id}
                close={() => setMoveState({ ...moveState, id: null })}
                folders={folders}
                formatedFolders={formatedFolders}
                defaultParentId={moveState.parentId}
                onSubmit={(parentId: number) => {
                    if (renameDialogState.type === 'pic') {
                        onPictureUpdate({ id: moveState.id, folderId: parentId });
                    } else {
                        if (parentId === moveState.id) {
                            message.warning('不能移动到当前文件夹下');
                            return;
                        }
                        onFolderUpdate({ id: moveState.id, parentId })
                    }
                    setMoveState({ ...moveState, id: null })
                }}
            />
            <MoveDialog
                open={!!moveState.id}
                close={() => setMoveState({ ...moveState, id: null })}
                folders={folders}
                formatedFolders={formatedFolders}
                defaultParentId={moveState.parentId}
                onSubmit={(parentId: number) => {
                    if (renameDialogState.type === 'pic') {
                        onPictureUpdate({ id: moveState.id, folderId: parentId });
                    } else {
                        if (parentId === moveState.id) {
                            message.warning('不能移动到当前文件夹下');
                            return;
                        }
                        onFolderUpdate({ id: moveState.id, parentId })
                    }
                    setMoveState({ ...moveState, id: null })
                }}
            />
            <MoveDialog
                open={!!(batchMoveState?.folderIds || batchMoveState?.pictureIds)}
                close={() => setBatchMoveState({})}
                folders={folders}
                formatedFolders={formatedFolders}
                defaultParentId={batchMoveState.parentId}
                onSubmit={(parentId: number) => {
                    if ((batchMoveState?.folderIds || []).includes(batchMoveState.parentId)) {
                        message.warning('不能移动到当前文件夹下');
                        return;
                    }
                    batchMove({ ...batchMoveState, parentId });
                    setBatchMoveState({});
                }}
            />
            <PictureEditDialog
                open={!!editPictureInfo}
                close={() => setEditPictureInfo(null)}
                pictureInfo={editPictureInfo}
                onUpload={onUpload}
                onCover={onCover}
                curFolderId={curFolderId}
                labels={labels}
            />
            <Viewer
                visible={!!viewPictureInfo}
                onClose={() => setViewPictureInfo(null)}
                images={[{ src: viewPictureInfo?.url }]}
            />
            <UploadDialog
                labels={labels}
                open={uploadDialogOpen}
                close={() => setUploadDialogOpen(false)}
                folders={folders}
                formatedFolders={formatedFolders}
                curFolderId={curFolderId}
                onUpload={onUpload}
            />
        </Paper>
    )
}

export default React.memo(PictureFields);
