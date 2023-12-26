import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import Info from './Info';

export type MenuItem = {
    key: string
    text: string;
    element: React.ReactNode
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'info',
        text: '基本信息',
        element: <Info />
    },

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
                onClick={() => toPage(`/profile/${menuItem.key}`)}
                selected={location.pathname.includes(`/profile/${menuItem.key}`)}
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