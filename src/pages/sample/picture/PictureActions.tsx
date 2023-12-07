import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { state, ESortMethod } from './store';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import PictureActionMain from './PictureActionMain';
import PictureActionBatch from './PictureActionBatch';

const PictureActions = ({
    showMode,
    toogleMode,
    selectedFolders,
    selectedImages,
    setSelectedFolders,
    setSelectedImages,
    pictures = [],
    showFolders = [],
    onUpload,
    folderIds,
    formatedFolders,
    updateFolderIds,
    openCreateDialog,
    changeSort,
    sortMethod,
    onSearch,
    isSearching,
    cancelSearch,
    openRenameDialog,
    openMoveDialog
}: {
    selectedFolders: number[];
    selectedImages: number[];
    setSelectedFolders: (data: number[]) => void;
    setSelectedImages: (data: number[]) => void;
    showFolders: state["folders"];
    pictures: state["pictures"];
    onUpload: (data: any) => void;
    toogleMode: () => void;
    showMode: state["showMode"];
    folderIds: state["folderIds"];
    formatedFolders: state["formatedFolders"];
    updateFolderIds: (ids: any[]) => void;
    openCreateDialog: () => void;
    changeSort: (sortMethod: ESortMethod) => void;
    sortMethod: ESortMethod;
    onSearch: (searchState: any) => void;
    isSearching: boolean;
    cancelSearch: () => void
    openRenameDialog: (name: string, type: 'pic' | 'folder', id: number) => void
    openMoveDialog: (data: { id: number; type: 'pic' | 'folder'; parentId: number }) => void
}) => {
    const selectAll = selectedImages.length === pictures.length && selectedFolders.length === showFolders.length
    const indeterminate = (selectedImages.length + selectedFolders.length < pictures.length + showFolders.length)
        && (selectedImages.length + selectedFolders.length > 0)

    return (
        <>
            <Stack
                direction="row"
                spacing={2}
            >
                <FormControlLabel
                    control={<Checkbox
                        checked={selectAll}
                        indeterminate={indeterminate}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedFolders(showFolders.map(item => item.id))
                                setSelectedImages(pictures.map(item => item.id))
                            } else {
                                setSelectedFolders([])
                                setSelectedImages([])
                            }
                        }}
                    />}
                    label="全选"
                />
                {
                    selectedImages.length + selectedFolders.length > 0 ? (
                        <PictureActionBatch
                            selectedFolders={selectedFolders}
                            selectedImages={selectedImages}
                            openRenameDialog={openRenameDialog}
                            openMoveDialog={openMoveDialog}
                            formatedFolders={formatedFolders}
                            pictures={pictures}
                        />
                    ) : (
                        <PictureActionMain
                            onSearch={onSearch}
                            openCreateDialog={openCreateDialog}
                            changeSort={changeSort}
                            sortMethod={sortMethod}
                            onUpload={onUpload}
                            showMode={showMode}
                            toogleMode={toogleMode}
                        />
                    )
                }
            </Stack>
            {
                isSearching ? (
                    <Stack
                        spacing={2}
                        direction="row"
                        sx={{ margin: '10px 0px' }}
                    >
                        <Link onClick={cancelSearch}>返回上一级</Link>
                        <Divider orientation="vertical" />
                        <Typography>搜索结果：</Typography>
                    </Stack>
                ) : (
                    <Breadcrumbs sx={{ margin: '10px 0px' }}>
                        {
                            folderIds
                                .map((id, index) => {
                                    if (id === 'un' || id === 0) return null
                                    return (
                                        <Link
                                            key={id}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                updateFolderIds(folderIds.filter((item, i) => i >= 0 && i < index + 1))
                                            }}
                                        >{formatedFolders[id]?.name}</Link>
                                    )
                                })
                        }
                    </Breadcrumbs>
                )
            }

        </>

    )
}

export default React.memo(PictureActions);