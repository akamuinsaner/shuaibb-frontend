import React from 'react';
import { TextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const TreeSelect = <T extends {
    id: number;
    name: string;
    parentId?: number;
    children?: T[]
}>({
    options,
    ...props
}: TextFieldProps & {
    options: T[]
}) => {
    const topOptions = options.filter(o => o.parentId === null);
    const [cascadeOpen, setCascadeOpen] = React.useState<{ [name: string]: boolean }>({});
    const renderOptions = React.useCallback((options: T[], depth: number = 0): any[] => {
        return [...(options.map((o) => {
            const hasChildren = o.children && o.children.length
            const showChildren = cascadeOpen[o.id]
            let renders = [
                <MenuItem
                    key={o.id}
                    sx={{ paddingLeft: `${depth * 20 + 16}px` }}
                    value={`${o.id}`}
                >
                    {(showChildren
                        ? <ArrowDropDownIcon
                            sx={{ opacity: hasChildren ? 1 : 0 }}
                            onClick={(e) => {
                                if (!hasChildren) return;
                                setCascadeOpen({ ...cascadeOpen, [o.id]: false })
                                e.stopPropagation();
                            }}
                        />
                        : <ArrowRightIcon
                            sx={{ opacity: hasChildren ? 1 : 0 }}
                            onClick={(e) => {
                                if (!hasChildren) return;
                                setCascadeOpen({ ...cascadeOpen, [o.id]: true })
                                e.stopPropagation();
                            }}
                        />)}
                    <Typography>{o.name}</Typography>
                </MenuItem>
            ];
            if (showChildren && hasChildren) {
                renders = [...renders, ...renderOptions(o.children, depth + 1)]
            }
            return renders;
        }))]
    }, [cascadeOpen]);
    return (
        <TextField
            label={props.label}
            select
            {...props}
            value={props.value}
            onChange={props.onChange}
            SelectProps={{
                renderValue: (value: any) => {
                    const o = options.find(o => `${o.id}` === `${value}`)
                    return o?.name
                }
            }}
        >
            {renderOptions(topOptions)}
        </TextField>
    )
}

export default TreeSelect;