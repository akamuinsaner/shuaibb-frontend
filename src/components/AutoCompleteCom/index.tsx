import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Config } from '../FilterFields'

const AutoCompleteCom = ({
    value,
    onChange,
    error,
    ...config
}: {
    value: any[];
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
        <Autocomplete
            disableListWrap
            disableCloseOnSelect
            size='small'
            fullWidth
            limitTags={2}
            getOptionLabel={typeof labelField === 'string' ? o => o[labelField] : labelField}
            renderTags={(selected) => {
                let render = renderField || labelField
                if (typeof render === 'string') {
                    return <Typography
                        noWrap
                        sx={{ maxWidth: 'calc(100% - 50px)' }}
                    >
                        {selected.map(s => s[render as string]).join(', ')}
                    </Typography>
                } else {
                    return <Typography
                        noWrap
                        sx={{ maxWidth: 'calc(100% - 50px)' }}
                    >{selected.map(render).join(', ')}</Typography>
                }
            }}
            multiple={multiple}
            options={options || []}
            value={Array.isArray(value)
                ? options.filter(o => value.includes(o[valueField]))
                : []}
            onChange={(e, v) => onChange(v.map(o => o[valueField]))}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={(Array.isArray(value) && value.length) ? '' : placeholder}
                    error={!!error}
                    helperText={error}
                />
            )}
        />
    )
}

export default React.memo(AutoCompleteCom);
