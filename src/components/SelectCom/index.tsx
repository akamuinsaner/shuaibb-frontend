import React from 'react';
import TextField from '@mui/material/TextField';
import { Config } from '../FilterFields';
import MenuItem from '@mui/material/MenuItem';

const SelectCom = ({
    value,
    onChange,
    error,
    ...config
}: {
    value: any;
    error: string;
    onChange: (v: any) => void;
} & Config) => {
    const {
        key,
        label,
        placeholder = label,
        selectProps: { labelField, renderField, multiple, options, valueField } = {},
    } = config;

    return (
        <TextField
            size='small'
            fullWidth
            select
            label={label}
            placeholder={placeholder}
            SelectProps={{ multiple }}
            value={multiple && !value ? [] : value}
            onChange={(e) => onChange(e.target.value as any)}
            error={!!error}
            helperText={error}
        >
            {options.map(o => <MenuItem
                value={o[valueField]}
                key={o[valueField]}
            >{
                typeof labelField === 'string'
                    ?  o[labelField]
                    : labelField(o)
            }</MenuItem>)}
        </TextField>
    )
}

export default React.memo(SelectCom);
