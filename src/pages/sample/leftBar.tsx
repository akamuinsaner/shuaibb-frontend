import React from 'react';
import SampleCenter from './center';
import SampleCreate from './create';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import PictureSpace from './picture';
import { withTranslation } from 'react-i18next';

export type MenuItem = {
    key: string
    text: string;
    element: React.ReactNode;
    langKey: string;
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'create',
        text: '新建样片',
        langKey: 'new sample',
        element: <SampleCreate />
    },
    {
        key: 'center',
        text: '样片中心',
        langKey: 'sample center',
        element: <SampleCenter />
    },
    {
        key: 'picture',
        text: '图片空间',
        langKey: 'photo space',
        element: <PictureSpace />
    },
]

const LeftBar = ({
    toPage,
    t
}: {
    toPage: (path: string) => void;
    t: any
}) => {
    const location = useLocation();
    const menu = MENUCONFIG.map((menuItem: MenuItem) => {
        return (
            <ListItemButton
                key={menuItem.key}
                onClick={() => toPage(`/sample/${menuItem.key}`)}
                selected={location.pathname.includes(`/sample/${menuItem.key}`)}
            >
                <ListItemText>{t(menuItem.langKey)}</ListItemText>
            </ListItemButton>
        )
    })

    return (
        <List>
            {menu}
        </List>
    )
}

export default withTranslation()(React.memo(LeftBar));