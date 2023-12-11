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
import { styled } from '@mui/material/styles';
import { state } from './store';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { sizeFormat } from 'utils/funcTools';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    width: 200,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));

const FileCatelog = ({
    size,
    folders,
    folderIds,
    changeFolderIds,
    idChildrenFolders,
    openCreateDialog,
    onSearch
}: {
    size: number;
    folders: state["folders"];
    idChildrenFolders: state["idChildrenFolders"]
    openCreateDialog: () => void
    folderIds: any[];
    changeFolderIds: (folderIds: any[]) => void;
    onSearch: () => void;
}) => {
    const totalBytes = 2 * 1024 * 1024;
    return (
        <Paper
            elevation={3}
            square={false}
            className={styles.fileCatelog}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
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
                    <Box sx={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center' }}>
                        <BorderLinearProgress variant="determinate" value={size / totalBytes * 100} />
                        <Typography sx={{ marginLeft: '20px' }}>{sizeFormat(size)}/2M</Typography>
                    </Box>

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
                                        copiedParents = copiedParents.slice(0, pIndex + 2)
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
