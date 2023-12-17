import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Customer } from 'declare/customer';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const SelectCustomerDialog = ({
    open,
    close,
    customers,
    submit
}: {
    open: boolean;
    close: () => void;
    customers: Customer[];
    submit: (customer: Customer) => void;
}) => {
    let timer: NodeJS.Timeout;
    const [name, setName] = React.useState<string>('')
    const [showCustomers, setShowCustomers] = React.useState<Customer[]>([]);
    const [customerId, setCustomerId] = React.useState<string>(null);
    React.useEffect(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            setShowCustomers(customers.filter(c => (c.name.includes(name) || c.phone.includes(name))));
        }, 500);
    }, [name])
    React.useEffect(() => {
        setShowCustomers(customers)
    }, [customers])
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>选择顾客</DialogTitle>
            <DialogContent>
                <TextField
                    placeholder='通过客户姓名或手机号搜索'
                    fullWidth
                    value={name}
                    size="small"
                    onChange={(e) => setName(e.target.value)}
                />
                <RadioGroup
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                >
                    <List>
                        {showCustomers.map(c => (
                            <>
                                <ListItem
                                    key={c.id}
                                    secondaryAction={
                                        <FormControlLabel label="" value={c.id} control={<Radio />} />
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={c.avatar} >{!c.avatar ? c.name.charAt(0) : null}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={c.name}
                                        secondary={c.phone}
                                    />
                                </ListItem>
                                <Divider />
                            </>

                        ))}
                    </List>
                </RadioGroup>

            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    style={{ marginRight: '10px' }}
                    onClick={close}
                >取消</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        const customer = customers.find(c => `${c.id}` === `${customerId}`);
                        close()
                        submit(customer);
                    }}
                >确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(SelectCustomerDialog);