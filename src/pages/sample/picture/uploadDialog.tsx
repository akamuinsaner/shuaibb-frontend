import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem'
import { state } from './store';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import { LabelSharp } from '@mui/icons-material';
import { SampleLabel } from 'declare/sample/index';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

const UploadDialog = ({
    open,
    close,
    folders = [],
    formatedFolders,
    labels,
    curFolderId,
    onUpload
}: {
    open: boolean;
    close: () => void;
    folders: state["folders"]
    formatedFolders: state["formatedFolders"];
    labels: SampleLabel[];
    curFolderId: any;
    onUpload: (data: any) => void;
}) => {
    const dropRef = React.useRef(null);
    const uploadRef = React.useRef(null);
    const [cascadeOpen, setCascadeOpen] = React.useState<{ [name: string]: boolean }>({});
    const [parentId, setParentId] = React.useState<string>(null);
    const [labelIds, setLabelIds] = React.useState([]);
    const [fileData, setFileData] = React.useState<any>(null);
    React.useEffect(() => {
        setParentId(curFolderId);
        setFileData(null);
        setLabelIds([])
        setCascadeOpen({})
    }, [curFolderId, open]);
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
    const handleFileData = (file: File) => {
        const fr = new FileReader()
        fr.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setFileData({
                    name: file.name,
                    file,
                    size: file.size,
                    width: img.width,
                    height: img.height
                });
                uploadRef.current.value = null
            }
            img.src = e.target.result as string;
        }
        fr.readAsDataURL(file)
    }
    const handleDrop = (e: any) => {
        e.preventDefault();
        const target = dropRef.current;
        if (e.type === 'drop') {
            target.style.borderColor = '#a89b9b';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image')) {
                handleFileData(file)
            }
        } else if (e.type === 'dragleave') {
            target.style.borderColor = '#a89b9b'
        } else {
            target.style.borderColor = 'red'
        }
    }
    return (
        <Dialog
            open={open}
            onClose={close}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>上传文件</DialogTitle>
            <DialogContent
                sx={{ padding: '24px !important' }}
            >
                <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField
                        fullWidth
                        label="上级文件夹"
                        select
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
                        fullWidth
                        label="标签"
                        select
                        value={labelIds}
                        onChange={(e) => setLabelIds(e.target.value as any)}
                        SelectProps={{
                            multiple: true
                        }}
                    >
                        {labels.map(label => (
                            <MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>
                        ))}
                    </TextField>
                    {
                        fileData ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>图片名称</TableCell>
                                        <TableCell>图片大小</TableCell>
                                        <TableCell>图片宽</TableCell>
                                        <TableCell>图片高</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{fileData.name}</TableCell>
                                        <TableCell>{fileData.size}</TableCell>
                                        <TableCell>{fileData.width}</TableCell>
                                        <TableCell>{fileData.height}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant='text'
                                                onClick={() => setFileData(null)}
                                            >删除</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ) : (
                            <div
                                onDragEnter={handleDrop}
                                onDragOver={handleDrop}
                                onDrop={handleDrop}
                                onDragLeave={handleDrop}
                                ref={dropRef}
                                style={{
                                    height: '400px',
                                    border: '1px dashed #aaa',
                                    backgroundColor: '#ddd',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Button
                                    variant='contained'
                                    size='large'
                                    startIcon={<CloudUploadIcon />}
                                    onClick={() => uploadRef.current.click()}
                                >上传</Button>
                                <Typography sx={{ margin: '24px 0' }} variant='h6'>点击按钮或将图片拖拽至此处上传</Typography>
                                <Typography>图片仅支持3MB以内jpg、jpeg、png、gif格式</Typography>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={uploadRef}
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target?.files?.length) {
                                            const file = e.target?.files[0]
                                            handleFileData(file)
                                            uploadRef.current.value = null;
                                        }
                                    }}
                                />
                            </div>
                        )
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={close}
                >取消</Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        const data = {...fileData, label_ids: labelIds}
                        if (parentId) data['folder_id'] = parentId;
                        onUpload(data)
                        close()
                    }}
                >上传</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(UploadDialog);