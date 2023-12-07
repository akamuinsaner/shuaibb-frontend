import React from 'react';
import SampleCenter from './center';
import SampleCreate from './create';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import PictureSpace from './picture';

export type MenuItem = {
    key: string
    text: string;
    element: React.ReactNode
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'create',
        text: '新建样片',
        element: <SampleCreate />
    },
    {
        key: 'center',
        text: '样片中心',
        element: <SampleCenter />
    },
    {
        key: 'picture',
        text: '图片空间',
        element: <PictureSpace />
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
                onClick={() => toPage(`/sample/${menuItem.key}`)}
                selected={location.pathname.includes(`/sample/${menuItem.key}`)}
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