import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { User } from 'declare/user';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';

const SelectCustomerDialog = ({
    open,
    close,
    users,
    submit,
    initialIds
}: {
    open: boolean;
    close: () => void;
    users: User[];
    submit: (users: User[]) => void;
    initialIds: number[]
}) => {
    let timer: NodeJS.Timeout;
    const [name, setName] = React.useState<string>('')
    const [showUsers, setShowUsers] = React.useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
    React.useEffect(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            setShowUsers(users.filter(c => (c.username.includes(name) || c.mobile.includes(name) || c.email.includes(name))));
        }, 500);
    }, [name])
    React.useEffect(() => {
        setShowUsers(users)
    }, [users])
    React.useEffect(() => {
        setSelectedUserIds(initialIds)
    }, [initialIds])
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>选择顾客</DialogTitle>
            <DialogContent>
                <TextField
                    placeholder='通过姓名或手机号或邮箱搜索'
                    fullWidth
                    value={name}
                    size="small"
                    onChange={(e) => setName(e.target.value)}
                />
                <List>
                    {showUsers.map(c => (
                        <ListItem
                            key={c.id}
                            secondaryAction={
                                <FormControlLabel label="" value={c.id} control={<Checkbox
                                    checked={selectedUserIds.includes(c.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedUserIds([...selectedUserIds, c.id]);
                                        else setSelectedUserIds(selectedUserIds.filter(id => id !== c.id));
                                    }}
                                />} />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={c.avatar} >{!c.avatar ? c.showName.charAt(0) : null}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={c.showName}
                            />
                        </ListItem>
                    ))}
                </List>

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
                        const userss = users.filter(c => selectedUserIds.includes(c.id));
                        close()
                        submit(userss);
                    }}
                >确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(SelectCustomerDialog);