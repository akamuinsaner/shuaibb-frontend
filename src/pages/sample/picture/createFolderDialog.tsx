import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PICTURE_FOLDER_NAME, STANDARD_NAME } from 'common/rexps';
import { createPictureFolders } from 'apis/picture/folder';
import { useMutation } from '@tanstack/react-query';
import useGlobalStore from 'globalStore';
import { state } from './store';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { message } from 'components/globalMessage';
import { Form } from 'components/FormValidator';

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
    const user = useGlobalStore(state => state.user);
    const [cascadeOpen, setCascadeOpen] = React.useState<{ [name: string]: boolean }>({});
    const createFolderMutation = useMutation({
        mutationFn: createPictureFolders,
        onSuccess: () => {
            message.success('创建成功');
            close();
            onSuccess()
        }
    })
    const renderFolders = React.useCallback((folders: state["folders"], depth: number = 0): any[] => {
        return [...(folders.map((folder) => {
            const hasChildren = folder.children && folder.children.length
            const showChildren = cascadeOpen[folder.id]
            let renders = [
                <MenuItem
                    key={folder.id}
                    sx={{ paddingLeft: `${depth * 20 + 16}px` }}
                    value={`${folder.id}`}
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
            maxWidth="sm"
            fullWidth
        >
            <Form
                initialValues={{ parentId: `${defaultSelectId}` }}
                submit={(values) => {
                    createFolderMutation.mutate({
                        name: values.name,
                        userId: user.id,
                        parentId: Number(values.parentId) || null
                    })
                }}
            >
                <DialogTitle>创建文件夹</DialogTitle>
                <DialogContent sx={{ paddingTop: '24px !important' }}>
                    <Form.Item
                        name="parentId"
                        rules={[
                            { required: true, msg: '请选择上级文件夹' },
                        ]}
                    >
                        <TextField
                            label="上级文件夹"
                            select
                            sx={{ marginBottom: '20px' }}
                            SelectProps={{
                                renderValue: (value: any) => {
                                    return formatedFolders[value]?.name
                                }
                            }}
                        >
                            {renderFolders(folders)}
                        </TextField>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, msg: '请输入文件夹名称' },
                            { regex: STANDARD_NAME, msg: '请输入1-20位字符' }
                        ]}
                    >
                        <TextField label="文件夹名称" />
                    </Form.Item>

                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={close}>取消</Button>
                    <Form.Submit><Button variant='contained'>确定</Button></Form.Submit>
                </DialogActions>
            </Form>
        </Dialog>
    )
}

export default React.memo(CreateFolderDialog);
