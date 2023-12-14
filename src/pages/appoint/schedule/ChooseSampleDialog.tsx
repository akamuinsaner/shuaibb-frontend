import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { SampleLabel, SampleData } from 'declare/sample';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useMutation } from '@tanstack/react-query';
import { listSample } from 'apis/sample';
import styles from './index.module.scss';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import { message } from 'components/globalMessage';

const ChooseSampleDialog = ({
    open,
    close,
    labels,
    submit
}: {
    open: boolean;
    close: () => void;
    labels: SampleLabel[];
    submit: (sample: SampleData) => void;
}) => {
    let nameTimer: NodeJS.Timeout;
    const [pageInfo, setPageInfo] = React.useState<{
        offset: number, limit: number, total: number
    }>({ offset: 0, limit: 10, total: 0 });
    const [list, setList] = React.useState<SampleData[]>([]);
    const [selected, setSelected] = React.useState<string>(null);
    const [name, setName] = React.useState<string>('');
    const [tagIds, setTagIds] = React.useState([]);
    const searchSampleMutation = useMutation({
        mutationFn: listSample,
        onSuccess: (data) => {
            setList(data.data);
            setPageInfo({ ...pageInfo, offset: data.offset, total: data.total });
            setSelected(null)
        }
    })
    React.useEffect(() => {
        clearTimeout(nameTimer);
        nameTimer = setTimeout(() => {
            searchSampleMutation.mutate({ name, tagIds, ...pageInfo });
        }, 500);
    }, [name])
    React.useEffect(() => {
        searchSampleMutation.mutate({ name, tagIds, ...pageInfo });
    }, [tagIds])
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            className={styles.chooseDialog}
        >
            <DialogTitle>选择已有套系</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
                    <TextField
                        placeholder='搜索套系名称'
                        size="small"
                        sx={{ width: '180px' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        select
                        size="small"
                        placeholder='搜索套系标签'
                        sx={{ width: '180px' }}
                        SelectProps={{ multiple: true }}
                        value={tagIds}
                        onChange={(e) => setTagIds(e.target.value as any)}
                    >
                        {labels.map(label => (
                            <MenuItem value={label.id} key={label.id}>{label.name}</MenuItem>
                        ))}
                    </TextField>
                </Stack>
                <RadioGroup
                    className={styles.sampleList}
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {list.map(sample => {
                        return <Box
                            key={sample.id}
                            className={`${styles.sampleItem} ${`${selected}` === `${sample.id}` ? styles.on : ''}`}

                        >
                            <FormControlLabel
                                value={sample.id}
                                control={<Radio size="small"/>}
                                label={sample.name}
                            />
                            <Typography className={styles.price}>￥{sample.price}</Typography>
                        </Box>
                    })}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    style={{ marginRight: '10px' }}
                    onClick={close}
                >取消</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (!selected) {
                            message.info('请选择一个套系');
                            return;
                        }
                        const sample = list.find(item => `${item.id}` === `${selected}`);
                        close();
                        submit(sample)
                    }}
                >确定</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(ChooseSampleDialog);
