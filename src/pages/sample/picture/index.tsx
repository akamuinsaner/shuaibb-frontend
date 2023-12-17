import React from 'react';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import FileCatelog from './FileCatelog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePictureStore, state, ESortMethod } from './store';
import {
    listPictureFolders,
    listPictures,
    createPictures,
    deletePicture,
    deletePictureFolders,
    updatePicture,
    updatePictureFolders,
    searchPictureAndFolder,
    batchDeletePictureAndFolder,
    batchMovePictureAndFolder,
    coverPictures,
    getTotalSize
} from 'apis/picture/folder';
import { sampleLabels } from 'apis/sample'
import CreateFolderDialog from './createFolderDialog';
import PictureFields from './PictureFields';
import { confirm } from 'components/confirmDialog';
import { message } from 'components/globalMessage';
import { PictureFolder, PictureInfo } from 'declare/picture';

const formatFolder = (folders: state["folders"], result: state["formatedFolders"] = {}) => {
    folders.map(folder => {
        result[folder.id] = folder;
        if (folder.children && folder.children.length) {
            formatFolder(folder.children, result);
        }
    })
    return result;
}

const formatIdFolder = (folders: state["folders"], result: state["idChildrenFolders"] = new Map) => {
    folders.map(folder => {
        if (result.get(folder.parentId)) {
            result.set(folder.parentId, [...result.get(folder.parentId), folder])
        } else {
            result.set(folder.parentId, [folder])
        }
        if (folder.children && folder.children.length) {
            formatIdFolder(folder.children, result);
        }
    })
    return result
}

const PictureSpace = () => {
    const {
        showMode,
        folders,
        pictures,
        folderIds,
        formatedFolders,
        idChildrenFolders,
        createFolderDialogOpen,
        defaultSelectId,
        sortMethod,
        searchedData,
        selectedImages,
        selectedFolders,
        updateState
    } = usePictureStore(state => state)
    const queryClient = useQueryClient();
    const [curFolderId, setCurFolderId] = React.useState<any>(null);

    const { data: labels = [] } = useQuery({ queryFn: sampleLabels, queryKey: ['sampleLabels'] });
    const { data: size = 0 } = useQuery({ queryFn: getTotalSize, queryKey: ["getTotalSize"] });
    const listFolderMutation = useMutation({
        mutationFn: listPictureFolders,
        onSuccess: (data) => {
            const ultimate = [{ id: null, name: '全部', parentId: 0 }, ...data]
            updateState({
                folders: ultimate,
                formatedFolders: formatFolder(ultimate),
                idChildrenFolders: formatIdFolder(ultimate)
            })
        }
    });
    const updateFolderMutation = useMutation({
        mutationFn: updatePictureFolders,
        onSuccess: (data) => message.success('更新成功', {
            closeCallback: () => listFolderMutation.mutate({ id: null })
        })
    })
    const deleteFolderMutation = useMutation({
        mutationFn: deletePictureFolders,
        onSettled: (data) => message.success('删除成功', {
            closeCallback: () => {
                listFolderMutation.mutate({ id: null });
                queryClient.invalidateQueries({ queryKey: ["getTotalSize"] });
            }
        })
    })
    const listPictureMutation = useMutation({
        mutationFn: listPictures,
        onSuccess: (data) => {
            updateState({ pictures: data })
        }
    })
    const createPictureMutation = useMutation({
        mutationFn: createPictures,
        onSuccess: (data) => message.success('上传成功', {
            closeCallback: () => {
                listPictureMutation.mutate({ folderId: curFolderId });
                queryClient.invalidateQueries({ queryKey: ["getTotalSize"] });
            }
        })
    })
    const updatePictureMutation = useMutation({
        mutationFn: updatePicture,
        onSuccess: (data) => message.success('更新成功', {
            closeCallback: () => listPictureMutation.mutate({ folderId: curFolderId })
        })
    })
    const deletePictureMutation = useMutation({
        mutationFn: deletePicture,
        onSettled: (data) => message.success('删除成功', {
            closeCallback: () => {
                listPictureMutation.mutate({ folderId: curFolderId });
                queryClient.invalidateQueries({ queryKey: ["getTotalSize"] });
            }
        })
    })
    const searchPicAndFolMutation = useMutation({
        mutationFn: searchPictureAndFolder,
        onSuccess: (data) => updateState({ searchedData: data })
    })
    const batchDeletePicAndFolderMutation = useMutation({
        mutationFn: batchDeletePictureAndFolder,
        onSettled: (data) => {
            updateState({ selectedFolders: [], selectedImages: [] });
            listFolderMutation.mutate({ id: null });
            listPictureMutation.mutate({ folderId: curFolderId });
            queryClient.invalidateQueries({ queryKey: ["getTotalSize"] });
        }
    })
    const batchMovePicAndFOlderMutation = useMutation({
        mutationFn: batchMovePictureAndFolder,
        onSuccess: (data) => {
            updateState({ selectedFolders: [], selectedImages: [] });
            listFolderMutation.mutate({ id: null });
            listPictureMutation.mutate({ folderId: curFolderId })
        }
    })
    const coverPictureMutation = useMutation({
        mutationFn: coverPictures,
        onSuccess: (data) => message.success('覆盖图片成功', {
            closeCallback: () => {
                listPictureMutation.mutate({ folderId: curFolderId });
                queryClient.invalidateQueries({ queryKey: ["getTotalSize"] });
            }
            
        })
    })
    React.useEffect(() => {
        listFolderMutation.mutate({ id: null });
    }, [])
    React.useEffect(() => {
        const preFolderId = folderIds[folderIds.length - 2]
        let curFolderId = folderIds[folderIds.length - 1]
        curFolderId = ((curFolderId === 'un') ? preFolderId : curFolderId)
        setCurFolderId(curFolderId)
        listPictureMutation.mutate({ folderId: curFolderId })
    }, [folderIds])
    const getSortFunc = React.useCallback(<T extends { name: string; updatedAt?: string }>() => {
        let sortFunc: (a?: T, b?: T) => any;
        switch (sortMethod) {
            case ESortMethod['name_asc']:
                sortFunc = (a, b) => (a.name < b.name ? -1 : 1)
                break;
            case ESortMethod['name_desc']:
                sortFunc = (a, b) => (a.name > b.name ? -1 : 1)
                break;
            case ESortMethod['date_asc']:
                sortFunc = (a, b) => (a.updatedAt < b.updatedAt ? -1 : 1)
                break;
            case ESortMethod['date_desc']:
                sortFunc = (a, b) => (a.updatedAt > b.updatedAt ? -1 : 1)
                break;
            case null:
            default:
                sortFunc = () => 0;
                break;
        }
        return sortFunc;
    }, [sortMethod]);
    const sortedFolders = (idChildrenFolders.get(curFolderId) || []).sort(getSortFunc<PictureFolder>())
    const sortedPictures = pictures.sort(getSortFunc<PictureFolder>())
    return (
        <Box
            className={styles.page}
        >
            <FileCatelog
                size={size || 0}
                folders={folders}
                folderIds={folderIds}
                changeFolderIds={(folderIds: number[]) => updateState({ folderIds })}
                idChildrenFolders={idChildrenFolders}
                openCreateDialog={() => updateState({ createFolderDialogOpen: true })}
                onSearch={() => listPictureMutation.mutate({ folderId: curFolderId })}
            />
            <PictureFields
                labels={labels}
                curFolderId={curFolderId}
                selectedImages={selectedImages}
                selectedFolders={selectedFolders}
                setSelectedFolders={(selectedFolders: number[]) => updateState({ selectedFolders })}
                setSelectedImages={(selectedImages: number[]) => updateState({ selectedImages })}
                folders={folders}
                folderIds={folderIds}
                sortMethod={sortMethod}
                updateFolderIds={(ids: any) => updateState({ folderIds: ids })}
                formatedFolders={formatedFolders}
                showMode={showMode}
                toogleMode={() => updateState({ showMode: showMode === 'grid' ? 'list' : 'grid' })}
                pictures={!!searchedData ? searchedData.pictures : sortedPictures}
                showFolders={!!searchedData ? searchedData.folders : sortedFolders}
                isSearching={!!searchedData}
                cancelSearch={() => updateState({ searchedData: null })}
                onSearch={(searchState: any) => searchPicAndFolMutation.mutate(searchState)}
                changeSort={(sortMethod: ESortMethod) => updateState({ sortMethod })}
                batchMove={(data: any) => batchMovePicAndFOlderMutation.mutate(data)}
                onPictureUpdate={(data: Partial<PictureInfo>) => {
                    updatePictureMutation.mutate(data);
                }}
                onFolderUpdate={(data: Partial<PictureFolder>) => {
                    updateFolderMutation.mutate(data);
                }}
                batchDelete={(data: any) => {
                    confirm.confirm({
                        title: '删除图片/文件夹',
                        content: '确认删除图片及文件夹吗？',
                        confirmCallback: () => batchDeletePicAndFolderMutation.mutate(data)
                    })
                }}
                onDelete={(name: string, id: number) => {
                    confirm.confirm({
                        title: '删除图片',
                        content: `确认删除图片【${name}】吗？`,
                        confirmCallback: () => deletePictureMutation.mutate(id)
                    })
                }}
                onFolderDelete={(name: string, id: number) => {
                    confirm.confirm({
                        title: '删除目录',
                        content: `确认删除目录【${name}】吗？`,
                        confirmCallback: () => deleteFolderMutation.mutate(id)
                    })
                }}
                openCreateDialog={() => updateState({ createFolderDialogOpen: true })}
                onClickFolder={(id: any) => {
                    let copiedIds = [...folderIds]
                    if (copiedIds[copiedIds.length - 1] === 'un') {
                        copiedIds[copiedIds.length - 1] = id;
                    } else {
                        copiedIds.push(id);
                    }
                    updateState({ folderIds: copiedIds })
                }}
                onUpload={(data: any) => {
                    const formdata = new FormData();
                    Object.entries(data).map(([key, value]: any) => formdata.append(key, value))
                    createPictureMutation.mutate(formdata)
                }}
                onCover={(data: any) => {
                    const formdata = new FormData();
                    Object.entries(data).map(([key, value]: any) => formdata.append(key, value))
                    coverPictureMutation.mutate(formdata)
                }}
            />
            <CreateFolderDialog
                folders={folders}
                formatedFolders={formatedFolders}
                open={createFolderDialogOpen}
                close={() => updateState({ createFolderDialogOpen: false })}
                onSuccess={() => listFolderMutation.mutate({ id: null })}
                defaultSelectId={curFolderId}
            />
        </Box>
    )
}

export default React.memo(PictureSpace);