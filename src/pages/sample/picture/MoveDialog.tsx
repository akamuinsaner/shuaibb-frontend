import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { state } from './store';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const MoveFolderDialog = ({
    open,
    close,
    folders,
    formatedFolders,
    defaultParentId,
    onSubmit
}: {
    open: boolean;
    close: () => void;
    folders: state["folders"]
    formatedFolders: state["formatedFolders"];
    defaultParentId: number;
    onSubmit: (parentId: number) => void
}) => {
    const [parentId, setParentId] = React.useState<string>(null);
    const [cascadeOpen, setCascadeOpen] = React.useState<{ [name: string]: boolean }>({});
    React.useEffect(() => {
        if (open) setParentId(`${defaultParentId}`)
    }, [open])
    const renderFolders = React.useCallback((folders: state["folders"], depth: number = 0): any[] => {
        return [...(folders.map((folder) => {
                    const hasChildren = folder.children && folder.children.length
                    const showChildren = cascadeOpen[folder.id]
                    let renders = [
                        <MenuItem
                            key={folder.id}
                            sx={{ paddingLeft: `${depth * 20 + 16}px` }}
                            value={folder.id}
                        >
                            {(showChildren
                                ? <ArrowDropDownIcon
                                    sx={{ opacity: hasChildren ? 1 : 0 }}
                                    onClick={(e) => {
                                        if (!hasChildren) return;
                                        setCascadeOpen({ ...cascadeOpen, [folder.id]: false })
                                        e.stopPropagation();
                                    }}
                                />
                                : <ArrowRightIcon
                                    sx={{ opacity: hasChildren ? 1 : 0 }}
                                    onClick={(e) => {
                                        if (!hasChildren) return;
                                        setCascadeOpen({ ...cascadeOpen, [folder.id]: true })
                                        e.stopPropagation();
                                    }}
                                />)}
                            <Typography>{folder.name}</Typography>
                        </MenuItem>
                    ];
                    if (showChildren && hasChildren) {
                        renders = [...renders, ...renderFolders(folder.children, depth + 1)]
                    } 
                    return renders;
                }))]
    }, [cascadeOpen]);
    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>创建文件夹</DialogTitle>
            <DialogContent sx={{ paddingTop: '24px !important' }}>
                <TextField
                    fullWidth
                    label="上级文件夹"
                    select
                    sx={{ marginBottom: '20px' }}
                    value={`${parentId}`}
                    onChange={(e) => setParentId(e.target.value)}
                    SelectProps={{
                        renderValue: (value: any) => {
                            return formatedFolders[value]?.name
                        }
                    }}
                >
                    {renderFolders(folders)}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={() => {
                        close();
                    }}
                >取消</Button>
                <Button
                    variant='contained'
                    sx={{ marginLeft: '16px' }}
                    onClick={() => onSubmit(Number(parentId) || null)}
                >确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(MoveFolderDialog);
