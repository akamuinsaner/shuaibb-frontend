import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import styles from './index.module.scss';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ChooseSampleDialog from './ChooseSampleDialog';
import SelectCustomersDialog from './selectCustomersDialog';
import { SampleData, SampleLabel } from 'declare/sample';
import dayjs from 'dayjs';
import { PayStatus } from 'declare/schedule';
import { Customer } from 'declare/customer';
import { Schedule } from 'declare/schedule';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import PeopleIcon from '@mui/icons-material/People';
import { User } from 'declare/user';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import globalStore from 'globalStore';
import IconButton from '@mui/material/IconButton'
import AddExecutorsDialog from './addExecutorsDialog';

const AddScheduleDialog = ({
    date,
    close,
    labels = [],
    submit,
    customers = [],
    users
}: {
    date: string;
    close: () => void;
    labels: SampleLabel[];
    submit: (data: Schedule) => void
    customers: Customer[];
    users: User[]
}) => {
    const { user } = globalStore(state => state);
    const [customerId, setCustomerId] = React.useState<number>(null);
    const [customerAvatar, setCustomerAvatar] = React.useState<string>('');
    const [customerName, setCustomerName] = React.useState<string>('');
    const [customerPhone, setCustomerPhone] = React.useState<string>('');
    const [dateSettled, setDateSettled] = React.useState<boolean>(true);
    const [shootDate, setShootDate] = React.useState<string>(null);
    const [startTime, setStartTime] = React.useState<string>(null);
    const [endTime, setEndTime] = React.useState<string>(null);
    const [openChooseDialog, setOpenChooseDialog] = React.useState<boolean>(false);
    const [openSelectDialog, setOpenSelectDialog] = React.useState<boolean>(false);
    const [openExecutorDialog, setOpenExecutorDialog] = React.useState<boolean>(false);
    const [sample, setSample] = React.useState<SampleData>(null);
    const [price, setPrice] = React.useState<number>(null);
    const [deposit, setDeposit] = React.useState<number>(null);
    const [payStatus, setPayStatus] = React.useState<PayStatus>(0);
    const [location, setLocation] = React.useState<string>('');
    const [executors, setExecutors] = React.useState<User[]>([user]);
    React.useEffect(() => {
        setShootDate(date);
    }, [date]);
    React.useEffect(() => {
        if (sample && startTime) {
            setEndTime(dayjs(startTime, 'hh:mm a').add(sample.shootingTime, 'h').format('hh:mm a'));
        }
    }, [sample, startTime]);
    return (
        <>
            <Dialog
                open={!!date}
                fullWidth
                maxWidth="sm"
                className={styles.addScheduleDialog}
            >
                <DialogTitle>新增订单</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                            <Paper className={styles.customerBox}>
                                <Box className={styles.avatar} >
                                    {customerAvatar ? <img src={customerAvatar} /> : null}
                                    {(customerName && !customerAvatar) ? customerName.charAt(0) : null}
                                </Box>
                                <Stack className={styles.info} spacing={1}>
                                    <TextField
                                        placeholder='请输入客户姓名'
                                        size='small'
                                        value={customerName}
                                        onChange={(e) => {
                                            setCustomerId(null);
                                            setCustomerName(e.target.value)
                                        }}
                                    />
                                    <TextField
                                        placeholder='请输入客户电话'
                                        size='small'
                                        value={customerPhone}
                                        onChange={(e) => {
                                            setCustomerId(null);
                                            setCustomerPhone(e.target.value)
                                        }}
                                    />
                                </Stack>
                                <AddCircleOutlineIcon
                                    htmlColor='#666'
                                    className={styles.addCustomer}
                                    onClick={() => setOpenSelectDialog(true)}
                                />
                            </Paper>
                            <Paper className={styles.sampleBox}>
                                <Stack spacing={1}>
                                    {
                                        dateSettled ? (
                                            <>
                                                <DatePicker
                                                    value={shootDate && dayjs(shootDate)}
                                                    onChange={(val) => setShootDate(val.format('YYYY-MM-DD'))}
                                                    disablePast
                                                    slotProps={{
                                                        textField: {
                                                            placeholder: '拍摄日期',
                                                            size: 'small',
                                                        },
                                                    }}
                                                />
                                                <Stack direction="row" spacing={1}>
                                                    <TimePicker
                                                        value={startTime && dayjs(startTime, 'hh:mm a')}
                                                        onChange={(val) => setStartTime(val.format('hh:mm a'))}
                                                        format="hh:mm"
                                                        slotProps={{
                                                            textField: {
                                                                placeholder: '开始时间',
                                                                size: 'small',
                                                            },
                                                        }}
                                                    />
                                                    <TimePicker
                                                        readOnly
                                                        format="hh:mm"
                                                        value={sample
                                                            && startTime
                                                            && dayjs(startTime, 'hh:mm a').add(sample.shootingTime, 'h')}
                                                        slotProps={{
                                                            textField: {
                                                                placeholder: '结束时间',
                                                                size: 'small',
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                            </>
                                        ) : null
                                    }
                                    <FormControlLabel control={<Checkbox
                                        checked={!dateSettled}
                                        onChange={(e) => setDateSettled(!e.target.checked as any)}
                                    />} label="日期待定" />
                                    <TextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                <DriveFileRenameOutlineIcon />
                                            </InputAdornment>,
                                        }}
                                        placeholder='请选择套系名称'
                                        required
                                        size='small'
                                        value={sample?.name}
                                        onFocus={(e) => e.currentTarget.blur()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.blur();
                                            setOpenChooseDialog(true);
                                        }}
                                    />
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    <CurrencyYenIcon />
                                                </InputAdornment>,
                                            }}
                                            placeholder='套系价格'
                                            required
                                            size='small'
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value as any)}

                                        />
                                        <TextField
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    <ShoppingBagIcon />
                                                </InputAdornment>,
                                            }}
                                            placeholder='套系定金'
                                            required
                                            size='small'
                                            value={deposit}
                                            onChange={(e) => setDeposit(e.target.value as any)}
                                        />
                                    </Stack>
                                </Stack>
                            </Paper>
                            <Paper className={styles.statusBox}>
                                <CurrencyYenIcon htmlColor='#666' />
                                <Typography>收款状态</Typography>
                                <Select
                                    placeholder='请选择'
                                    required
                                    size='small'
                                    sx={{ width: 180, marginLeft: 'auto' }}
                                    value={payStatus}
                                    onChange={(e) => setPayStatus(e.target.value as any)}
                                >
                                    <MenuItem value={PayStatus['未付款']}>未付款</MenuItem>
                                    <MenuItem value={PayStatus['已付定金']}>已付定金</MenuItem>
                                    <MenuItem value={PayStatus['已付全款']}>已付全款</MenuItem>
                                </Select>
                            </Paper>
                            <Paper className={styles.remarkBox}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        placeholder='请输入拍摄地点'
                                        fullWidth
                                        size="small"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                <AddLocationAltIcon />
                                            </InputAdornment>,
                                        }}
                                    />
                                </Stack>
                            </Paper>
                            <Paper className={styles.executorBox}>
                                <PeopleIcon sx={{ marginRight: '10px' }} />
                                <Typography>执行人：</Typography>
                                <AvatarGroup
                                    renderSurplus={(surplus) => <span>+{surplus.toString()[0]}k</span>}
                                    total={executors.length}
                                >
                                    {executors.map(user => <Avatar
                                        key={user.id}
                                        src={user.avatar}
                                    >{!user.avatar && user.showName.charAt(0)}</Avatar>)}
                                </AvatarGroup>
                                <IconButton onClick={() => setOpenExecutorDialog(true)}><AddCircleIcon htmlColor='#1976d2' /></IconButton>
                            </Paper>
                        </Stack>
                    </LocalizationProvider>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={close}
                        style={{ marginRight: '10px' }}
                    >取消</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            const data: Schedule = {
                                customerId, customerName, customerPhone, shootDate,
                                startTime, endTime, dateSettled, sampleId: sample.id,
                                price, deposit, payStatus, location,
                                executorIds: executors.map(item => item.id)
                            }
                            close();
                            submit(data);
                        }}
                    >提交</Button>
                </DialogActions>
            </Dialog>
            <ChooseSampleDialog
                open={openChooseDialog}
                close={() => setOpenChooseDialog(false)}
                labels={labels}
                submit={(sample: SampleData) => {
                    setSample(sample);
                    setPrice(sample.price);
                    setDeposit(sample.deposit);
                }}
            />
            <SelectCustomersDialog
                open={openSelectDialog}
                close={() => setOpenSelectDialog(false)}
                customers={customers}
                submit={(customer) => {
                    setCustomerId(customer.id);
                    setCustomerAvatar(customer.avatar)
                    setCustomerName(customer.name);
                    setCustomerPhone(customer.phone);
                }}
            />
            <AddExecutorsDialog
                open={openExecutorDialog}
                close={() => setOpenExecutorDialog(false)}
                users={users}
                initialIds={executors.map(u => u.id)}
                submit={(users) => setExecutors(users)}
            />
        </>

    )
}

export default React.memo(AddScheduleDialog);
