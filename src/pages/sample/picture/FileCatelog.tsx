import React from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select'
import Grid from '@mui/material/Grid';
import styles from './index.module.scss'
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { state } from './store';

const FileCatelog = ({
    folders,
    folderIds,
    changeFolderIds,
    idChildrenFolders,
    openCreateDialog,
    onSearch
}: {
    folders: state["folders"];
    idChildrenFolders: state["idChildrenFolders"]
    openCreateDialog: () => void
    folderIds: any[];
    changeFolderIds: (folderIds: any[]) => void;
    onSearch: () => void;
}) => {

    return (
        <Paper
            elevation={3}
            square={false}
            className={styles.fileCatelog}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>文件目录</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ margin: '0 16px' }}
                        onClick={openCreateDialog}
                    >新建目录</Button>
                    <Button
                        variant="contained"
                        onClick={onSearch}
                    >
                        查询
                    </Button>
                </Grid>
                {
                    folderIds.map((parentId, pIndex) => {
                        const childeren = idChildrenFolders.get(parentId) || []
                        if (!childeren.length) return null
                        return (
                            <Grid key={parentId} item xs={2}>
                                <Select
                                    fullWidth
                                    size='small'
                                    value={[`${folderIds[pIndex + 1]}`]}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        let copiedParents = [...folderIds];
                                        copiedParents[pIndex + 1] = value
                                        if (value === 'un') copiedParents = copiedParents.slice(0, pIndex + 2)
                                        changeFolderIds(copiedParents);
                                    }}
                                >
                                    <MenuItem value={'un'}>---------</MenuItem>
                                    {childeren.map((folder, cIndex) => {
                                        return <MenuItem
                                            key={folder.id}
                                            value={folder.id}>
                                            {folder.name}
                                        </MenuItem>
                                    })}
                                </Select>
                            </Grid>
                        )
                    })
                }

            </Grid>
        </Paper>
    )
}

export default React.memo(FileCatelog);
