import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import styles from './index.module.scss';
import dayjs from 'dayjs';

const AppointHeader = ({
    monthState,
    updateMonthState
}: {
    monthState: { year: number; month: number };
    updateMonthState: (state: { year: number; month: number }) => void
}) => {
    const getYearList = React.useCallback(() => {
        const thisYear = dayjs().year();
        return Array(10).fill({}).map((item, i) => (thisYear - 5 + i))
    }, []);
    return (
        <Box
            className={styles.header}
        >
            <Box></Box>
            <Stack
                direction="row"
                spacing={4}
                className={styles.switchMonth}
                sx={{ alignItems: 'center' }}
            >
                <ArrowBackIosNewIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        if (monthState.month === 1) {
                            updateMonthState({ year: monthState.year - 1, month: 12 })
                        } else {
                            updateMonthState({ ...monthState, month: monthState.month - 1 })
                        }
                    }}
                />
                <Select
                    value={`${monthState.year}`}
                    size="small"
                    sx={{ width: 150 }}
                    onChange={(e) => updateMonthState({ ...monthState, year: Number(e.target.value) })}
                >
                    {getYearList().map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
                <Select
                    value={`${monthState.month}`}
                    size="small"
                    sx={{ width: 150 }}
                    onChange={(e) => updateMonthState({ ...monthState, month: Number(e.target.value) })}
                >
                    {Array(12).fill({}).map((item, i) => (
                        <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                    ))}
                </Select>
                <ArrowForwardIosIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        if (monthState.month === 12) {
                            updateMonthState({ year: monthState.year + 1, month: 1 })
                        } else {
                            updateMonthState({ ...monthState, month: monthState.month + 1 })
                        }
                    }}
                />
            </Stack>
            <Box></Box>
        </Box>
    )
}

export default React.memo(AppointHeader);