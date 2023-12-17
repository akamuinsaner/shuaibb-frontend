import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import Schedule from './schedule';
import AppointmentCenter from './center';
import Customers from './customer';

export type MenuItem = {
    key: string
    text: string;
    element: React.ReactNode
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'schedule',
        text: '订单日历',
        element: <Schedule />
    },
    {
        key: 'center',
        text: '订单中心',
        element: <AppointmentCenter />
    },
    {
        key: 'customer',
        text: '客户中心',
        element: <Customers />
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
                onClick={() => toPage(`/appointment/${menuItem.key}`)}
                selected={location.pathname.includes(`/appointment/${menuItem.key}`)}
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