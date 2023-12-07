import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PICTURE_FOLDER_NAME } from 'common/rexps';
import { createPictureFolders } from 'apis/picture/folder';
import { useMutation } from '@tanstack/react-query';
import useGlobalStore from 'globalStore';
import { state } from './store';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { message } from 'components/globalMessage';

const CreateFolderDialog = ({
    open,
    close,
    folders,
    formatedFolders,
    onSuccess,
    defaultSelectId
}: {
    open: boolean;
    close: () => void;
    folders: state["folders"]
    formatedFolders: state["formatedFolders"];
    onSuccess: () => void;
    defaultSelectId: any
}) => {
    const [name, setName] = React.useState<string>('');
    const [nameErr, setNameErr] = React.useState<string>('');
    const [parentId, setParentId] = React.useState<string>(null);
    const user = useGlobalStore(state => state.user);
    const [cascadeOpen, setCascadeOpen] = React.useState<{ [name: string]: boolean }>({});
    const resetState = () => {
        setName('');
        setNameErr('');
        setParentId('0')
    }
    const createFolderMutation = useMutation({
        mutationFn: createPictureFolders,
        onSuccess: () => {
            message.success('创建成功');
            resetState();
            close();
            onSuccess()
        }
    })
    React.useEffect(() => {
        setParentId(defaultSelectId)
    }, [defaultSelectId, open]);
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
                <TextField
                    label="文件夹名称"
                    value={name}
                    error={!!nameErr}
                    helperText={nameErr}
                    fullWidth
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value && PICTURE_FOLDER_NAME.test(e.target.value)) {
                            setNameErr('');
                        } else if (!value) {
                            setNameErr('请输入1-10个字符');
                        } else {
                            setNameErr('请输入正确的格式');
                        }
                        setName(value)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={() => {
                        resetState();
                        close();
                    }}
                >取消</Button>
                <Button
                    variant='contained'
                    sx={{ marginLeft: '16px' }}
                    onClick={() => {
                        createFolderMutation.mutate({
                            name,
                            userId: user.id,
                            parentId: Number(parentId) || null
                        })
                    }}
                >确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(CreateFolderDialog);
