import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSampleCenterStore, initialState } from './store';
import styles from './index.module.scss';
import type { SampleLabel } from 'declare/sample';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const FilterFields = ({
    labels = [],
    onSearch,
    onClear
}: {
    labels: SampleLabel[],
    onSearch: () => void,
    onClear: () => void
}) => {
    const {
        name,
        tagIds,
        startDate,
        endDate,
        updateState,
    } = useSampleCenterStore(state => state)
    return (
        <Paper
            elevation={2}
            square={false}
            sx={{ padding: '24px' }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} className={styles.filters}>
                    <Grid item xs={3}>
                        <TextField
                            error={!!name.errText}
                            fullWidth
                            label="样片名称"
                            size="small"
                            value={name.value}
                            onChange={(e) => updateState({ name: { ...name, value: e.target.value } })}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            error={!!tagIds.errText}
                            fullWidth
                            label="样片标签"
                            size="small"
                            value={tagIds.value}
                            onChange={(e) => updateState({ tagIds: { ...tagIds, value: e.target.value as any } })}
                            select
                            SelectProps={{
                                multiple: true
                            }}
                        >
                            {labels.map((label: SampleLabel) =>
                                <MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker
                            label="开始日期"
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    error: !!startDate.errText,
                                    helperText: startDate.errText
                                },
                            }}
                            value={dayjs(startDate.value)}
                            onChange={(value) => {
                                const invalidate = endDate.value && value.isAfter(dayjs(endDate.value))
                                updateState({
                                    startDate: {
                                        ...startDate,
                                        value: value.format('YYYY-MM-DD'),
                                        errText: invalidate ? '开始日期不能晚于结束日期' : ''
                                    },
                                    endDate: {
                                        ...endDate,
                                        errText: !invalidate ? '' : endDate.errText
                                    }
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker
                            label="结束日期"
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    error: !!endDate.errText,
                                    helperText: endDate.errText
                                },
                            }}
                            value={dayjs(endDate.value)}
                            onChange={(value) => {
                                const invalidate = startDate.value && value.isBefore(dayjs(startDate.value))
                                updateState({
                                    endDate: {
                                        ...endDate,
                                        value: value.format('YYYY-MM-DD'),
                                        errText: invalidate ? '结束日期不能早于开始日期' : ''
                                    },
                                    startDate: {
                                        ...startDate,
                                        errText: !invalidate ? '' : startDate.errText
                                    }
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onClear}
                        >清空搜索条件</Button>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '16px' }}
                            onClick={onSearch}
                        >搜索</Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Paper>

    )
}

export default React.memo(FilterFields);