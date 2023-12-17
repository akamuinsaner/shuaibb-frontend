import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import Group from './group';
import Permission from './permission';
import User from './user';


export type MenuItem = {
    key: string
    text: string;
    element: React.ReactNode
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'group',
        text: '群组管理',
        element: <Group />
    },
    {
        key: 'permission',
        text: '权限管理',
        element: <Permission />
    },
    {
        key: 'user',
        text: '用户管理',
        element: <User />
    }
]

const LeftBar = ({
    toPage
}: {
    toPage: (path: string) => void
}) => {
    const location = useLocation();
    const menu = MENUCONFIG.map((menuItem: MenuItem) => {
        return (
            <ListItemButton
                key={menuItem.key}
                onClick={() => toPage(`/auth/${menuItem.key}`)}
                selected={location.pathname.includes(`/auth/${menuItem.key}`)}
            >
                <ListItemText>{menuItem.text}</ListItemText>
            </ListItemButton>
        )
    })

    return (
        <List>
            {menu}
        </List>
    )
}

export default React.memo(LeftBar);