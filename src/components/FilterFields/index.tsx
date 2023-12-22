import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from './index.module.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import AutoCompleteCom from 'components/AutoCompleteCom';
import SelectCom from 'components/SelectCom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export type SelectProps = {
    options?: any[];
    multiple?: boolean;
    renderField?: string | { (o: any): string };
    valueField?: string;
    labelField?: string | { (o: any): string };
}

export type Config = {
    key: string;
    label: string;
    placeholder?: string;
    type?: 'input' | 'select' | 'autoComplete' | 'date';
    selectProps?: SelectProps
}

const FilterFields = ({
    errors,
    data,
    configs,
    onChange,
    reset,
    search
}: {
    errors?: { [name: string]: string };
    data: { [name: string]: any };
    configs: Config[];
    onChange: (key: string, value: any) => void;
    reset: () => void;
    search: (data) => void;
}) => {
    const renderFormItem = React.useCallback((config: Config) => {
        switch (config.type) {
            case 'autoComplete':
                return <AutoCompleteCom
                    {...config}
                    value={data[config.key]}
                    onChange={(v) => onChange(config.key, v)}
                    error={errors?.[config.key]}
                />
            case 'select':
                return <SelectCom
                    {...config}
                    value={data[config.key]}
                    onChange={(v) => onChange(config.key, v)}
                    error={errors?.[config.key]}
                />
            case 'date':
                return <DatePicker
                    label={config.label}
                    slotProps={{
                        textField: {
                            size: 'small',
                            fullWidth: true,
                            placeholder: config.placeholder || config.label,
                            error: !!errors?.[config.key],
                            helperText: errors?.[config.key]
                        },
                    }}
                    value={data?.key ? dayjs(data['key']) : null}
                    onChange={(value) => onChange(config.key, value.format('YYYY-MM-DD'))}
                />
            case 'input':
            default:
                return <TextField
                    fullWidth
                    size='small'
                    label={config.label}
                    placeholder={config.placeholder || config.label}
                    value={data?.key}
                    onChange={(e) => onChange(config.key, e.target.value)}
                    error={!!errors?.[config.key]}
                    helperText={errors?.[config.key]}
                />
        }
    }, [data, errors]);

    const renderFields = React.useCallback(() => {
        return configs.map(config => (
            <Grid key={config.key} xs={3} item>
                {renderFormItem(config)}
            </Grid>
        ))
    }, [configs]);
    return (
        <Paper
            elevation={2}
            square={false}
            className={styles.filterFields}
        >
            <Grid
                className={styles.formFields}
                container
                spacing={2}
                sx={{ padding: '20px' }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {renderFields()}
                </LocalizationProvider>

            </Grid>
            <Divider
                orientation="vertical"
                variant="middle"
                flexItem
            />
            <Stack
                spacing={2}
                direction="row"
                sx={{ padding: '20px' }}
            >
                <Button
                    variant='outlined'
                    color='error'
                    onClick={reset}
                >重置</Button>
                <Button
                    variant='contained'
                    onClick={search}
                >搜索</Button>
            </Stack>
        </Paper>
    )
}

export default React.memo(FilterFields);
