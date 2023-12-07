import React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Popover from '@mui/material/Popover';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SortIcon from '@mui/icons-material/Sort';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';
import { state, ESortMethod } from './store';

const PictureActionMain = ({
    onSearch,
    openCreateDialog,
    changeSort,
    sortMethod,
    onUpload,
    toogleMode,
    showMode
}: {
    onSearch: (searchState: any) => void
    openCreateDialog: () => void;
    changeSort: (sortMethod: ESortMethod) => void;
    sortMethod: ESortMethod;
    onUpload: (data: any) => void;
    toogleMode: () => void;
    showMode: state["showMode"];
}) => {
    const uploadRef = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [searchState, setSearchState] = React.useState<{
        name?: string; startDate?: string; endDate?: string
    }>({})
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px'
            }}>
                <Button
                    sx={{ p: '10px' }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    高级搜索
                </Button>
                <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Stack spacing={2} sx={{ padding: '24px' }}>
                        <Typography sx={{ marginBottom: '16px' }}>高级搜索</Typography>
                        {/* <Stack direction="row" spacing={2}>
                    <RadioGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        <FormControlLabel value="female" control={<Radio />} label="按图片/文件夹搜索" />
                        <FormControlLabel value="male" control={<Radio />} label="按宝贝名称搜索" />
                    </RadioGroup>
                </Stack> */}
                        <Stack spacing={3} direction="row">
                            <Button
                                variant='outlined'
                                onClick={() => setSearchState({
                                    ...searchState,
                                    startDate: dayjs().subtract(7, 'd').format('YYYY-MM-DD'),
                                    endDate: dayjs().format('YYYY-MM-DD'),
                                })}
                            >近一周</Button>
                            <Button
                                variant='outlined'
                                onClick={() => setSearchState({
                                    ...searchState,
                                    startDate: dayjs().subtract(1, 'M').format('YYYY-MM-DD'),
                                    endDate: dayjs().format('YYYY-MM-DD'),
                                })}
                            >近一个月</Button>
                            <Button
                                variant='outlined'
                                onClick={() => setSearchState({
                                    ...searchState,
                                    startDate: dayjs().subtract(6, 'M').format('YYYY-MM-DD'),
                                    endDate: dayjs().format('YYYY-MM-DD'),
                                })}
                            >近6个月</Button>
                        </Stack>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={2} direction="row">
                                <DatePicker
                                    label="开始日期"
                                    value={searchState?.startDate && dayjs(searchState.startDate)}
                                    maxDate={searchState?.endDate ? dayjs(searchState.endDate) : null}
                                    onChange={(value) => setSearchState({ ...searchState, startDate: value.format('YYYY-MM-DD') })}
                                />
                                <DatePicker
                                    label="结束日期"
                                    value={searchState?.endDate && dayjs(searchState.endDate)}
                                    disableFuture
                                    minDate={searchState?.startDate ? dayjs(searchState.startDate) : null}
                                    onChange={(value) => setSearchState({ ...searchState, endDate: value.format('YYYY-MM-DD') })}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <Box
                            sx={{
                                display: 'flex',
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                            }}
                        >
                            <Button
                                sx={{ p: '10px' }}
                            >
                                关键词
                            </Button>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="请输入关键词"
                                value={searchState.name}
                                onChange={(e) => setSearchState({ ...searchState, name: e.target.value })}
                            />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                variant='text'
                                sx={{ marginRight: '10px' }}
                                onClick={() => setAnchorEl(null)}
                            >取消</Button>
                            <Button variant="contained" onClick={() => {
                                onSearch(searchState);
                                setAnchorEl(null)
                            }}>确定</Button>
                        </Box>
                    </Stack>
                </Popover>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="请输入关键词"
                    value={searchState.name}
                    onChange={(e) => setSearchState({ ...searchState, name: e.target.value })}
                />
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    onClick={() => onSearch(searchState)}
                >
                    <SearchIcon />
                </IconButton>
            </Box>
            <Button
                variant='contained'
                onClick={openCreateDialog}
            >新建文件夹</Button>
            <Button
                variant='contained'
                onClick={() => uploadRef.current.click()}
            >上传文件
            </Button>
            <Tooltip title={showMode === 'grid' ? '列表模式' : '阵列模式'}>
                <IconButton onClick={toogleMode}>
                    {showMode === 'grid' ? <FormatListBulletedIcon /> : <AppsIcon />}
                </IconButton>
            </Tooltip>
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState: any) => (
                    <React.Fragment>
                        <Tooltip title="排序">
                            <IconButton {...bindTrigger(popupState)}>
                                <SortIcon />
                            </IconButton>
                        </Tooltip>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => {
                                changeSort(sortMethod !== ESortMethod['name_asc'] ? ESortMethod['name_asc'] : null)
                                popupState.close()
                            }}>
                                <Typography>文件名升序</Typography>
                                {sortMethod === ESortMethod['name_asc'] ? <CheckIcon /> : null}
                            </MenuItem>
                            <MenuItem onClick={() => {
                                changeSort(sortMethod !== ESortMethod['name_desc'] ? ESortMethod['name_desc'] : null)
                                popupState.close()
                            }}>
                                <Typography>文件名降序</Typography>
                                {sortMethod === ESortMethod['name_desc'] ? <CheckIcon /> : null}
                            </MenuItem>
                            <MenuItem onClick={() => {
                                changeSort(sortMethod !== ESortMethod['date_asc'] ? ESortMethod['date_asc'] : null)
                                popupState.close()
                            }}>
                                <Typography>上传时间升序</Typography>
                                {sortMethod === ESortMethod['date_asc'] ? <CheckIcon /> : null}
                            </MenuItem>
                            <MenuItem onClick={() => {
                                changeSort(sortMethod !== ESortMethod['date_desc'] ? ESortMethod['date_desc'] : null)
                                popupState.close()
                            }}>
                                <Typography>上传时间降序</Typography>
                                {sortMethod === ESortMethod['date_desc'] ? <CheckIcon /> : null}
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>
            <input
                type="file"
                style={{ display: 'none' }}
                ref={uploadRef}
                accept="image/*"
                onChange={e => {
                    if (e.target?.files?.length) {
                        const file = e.target?.files[0]
                        const fr = new FileReader()
                        fr.onload = (e) => {
                            const img = new Image();
                            img.onload = () => {
                                onUpload({
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
                }}
            />
        </>
    )
}

export default React.memo(PictureActionMain);
