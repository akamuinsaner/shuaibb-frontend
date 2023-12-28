import React from 'react';
import SampleCenter from './center';
import SampleCreate from './create';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { useLocation } from 'react-router';
import PictureSpace from './picture';
import SampleLabel from './label';
import { useTranslation } from 'react-i18next';

export type MenuItem = {
    key: string
    element: React.ReactNode;
    langKey: string;
}

export const MENUCONFIG: MenuItem[] = [
    {
        key: 'create',
        langKey: 'new sample',
        element: <SampleCreate />
    },
    {
        key: 'center',
        langKey: 'sample center',
        element: <SampleCenter />
    },
    {
        key: 'picture',
        langKey: 'photo space',
        element: <PictureSpace />
    },
    {
        key: 'label',
        langKey: 'sample labels',
        element: <SampleLabel />
    },
]

const LeftBar = ({
    toPage,
}: {
    toPage: (path: string) => void;
}) => {
    const { t } = useTranslation();
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

export default React.memo(LeftBar);