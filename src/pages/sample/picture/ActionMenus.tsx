import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


export const PictureMenu = ({
    deleteFuc,
    renameFunc,
    moveFunc,
    editFunc,
    children,
    right = false
}: {
    deleteFuc: () => void
    renameFunc: () => void
    moveFunc: () => void
    editFunc: () => void
    children: any;
    right?: boolean
}) => {
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState: any) => {
                let props = { ...bindTrigger(popupState) };
                if (right) {
                    props = Object.assign({}, props, {
                        onClick: null,
                        onContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                            e.preventDefault();
                            bindTrigger(popupState).onClick(e);
                        }
                    })
                }
                return (<React.Fragment>
                    {React.cloneElement(children, { ...props })}
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={() => {
                            deleteFuc()
                            popupState.close()
                        }}>删除</MenuItem>
                        <MenuItem onClick={() => {
                            editFunc()
                            popupState.close()
                        }}>编辑</MenuItem>
                        <MenuItem onClick={() => {
                            renameFunc()
                            popupState.close()
                        }}>重命名</MenuItem>
                        <MenuItem
                            onClick={() => {
                                moveFunc()
                                popupState.close()
                            }}
                        >移动</MenuItem>
                    </Menu>
                </React.Fragment>)
            }}
        </PopupState>
    )
}

export const FolderMenu = ({
    deleteFuc,
    renameFunc,
    moveFunc,
    children,
    right = false
}: {
    deleteFuc: () => void
    renameFunc: () => void
    moveFunc: () => void
    children: any
    right?: boolean
}) => {
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState: any) => {
                let props = { ...bindTrigger(popupState) };
                if (right) {
                    props = Object.assign({}, props, {
                        onClick: null,
                        onContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                            e.preventDefault();
                            bindTrigger(popupState).onClick(e);
                        }
                    })
                }
                return (<React.Fragment>
                    {React.cloneElement(children, { ...props })}
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={() => {
                            deleteFuc()
                            popupState.close()
                        }}>删除</MenuItem>
                        <MenuItem onClick={() => {
                            renameFunc()
                            popupState.close()
                        }}>重命名</MenuItem>
                        <MenuItem
                            onClick={() => {
                                moveFunc()
                                popupState.close()
                            }}
                        >移动</MenuItem>
                    </Menu>
                </React.Fragment>)
            }}
        </PopupState>
    )
}
