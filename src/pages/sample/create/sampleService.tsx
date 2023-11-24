import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { SampleServiceState } from './store';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

const SampleService = ({
    data,
    updateData
}: {
    data: SampleServiceState;
    updateData: (data: Partial<SampleServiceState>) => void
}) => {
    console.log(data)
    return (
        <Item>
            <Stack spacing={2}>
                <Typography>服务内容</Typography>
                <FormControl >
                    <FormLabel>基础服务内容</FormLabel>
                    <RadioGroup
                        row
                        value={`${Number(data.basicInfoVisible)}`}
                        onChange={(e) => updateData({ basicInfoVisible: !!Number(e.target.value) })}
                    >
                        <FormControlLabel value={`1`} control={<Radio />} label="显示信息" />
                        <FormControlLabel value={`0`} control={<Radio />} label="暂不显示" />
                    </RadioGroup>
                </FormControl>
                {
                    data.basicInfoVisible ? (
                        <Item>
                            <Grid
                                spacing={2}
                                container
                            >
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="服装造型"
                                        fullWidth
                                        size='small'
                                        select
                                        value={data.costumeOffer ? '1' : '0'}
                                        onChange={(e) => updateData({ costumeOffer: !!Number(e.target.value) })}
                                    >
                                        <MenuItem value={`0`}>不提供</MenuItem>
                                        <MenuItem value={`1`}>提供</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item>
                                    {data.costumeOffer ? <TextField
                                        required
                                        label="服装套数"
                                        fullWidth
                                        size='small'
                                        select
                                        value={`${data.costumeCount}`}
                                        onChange={(e) => updateData({ costumeCount: Number(e.target.value) })}
                                    >
                                        <MenuItem value={`1`}>1套</MenuItem>
                                        <MenuItem value={`2`}>2套</MenuItem>
                                        <MenuItem value={`3`}>3套</MenuItem>
                                        <MenuItem value={`4`}>4套</MenuItem>
                                        <MenuItem value={`5`}>5套</MenuItem>
                                        <MenuItem value={`0`}>自定义</MenuItem>
                                    </TextField> : null}
                                </Grid>
                                <Grid xs={4} item>
                                    {data.costumeCount === 0 ? <TextField
                                        required
                                        label="自定义套数"
                                        fullWidth
                                        size='small'
                                        placeholder='请填写套系数量'
                                        value={data.customCostumeCount}
                                        onChange={(e) => updateData({ customCostumeCount: Number(e.target.value) })}
                                    /> : null}
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="底片数量"
                                        fullWidth
                                        size='small'
                                        value={data.negativeFilmCount}
                                        onChange={(e) => updateData({ negativeFilmCount: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="底片全送"
                                        fullWidth
                                        size='small'
                                        select
                                        value={data.negaFilmAllOffer ? '1' : '0'}
                                        onChange={(e) => updateData({ negaFilmAllOffer: !!Number(e.target.value) })}
                                    >
                                        <MenuItem value={`0`}>否</MenuItem>
                                        <MenuItem value={`1`}>是</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item></Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="拍摄时长"
                                        fullWidth
                                        size='small'
                                        select
                                        value={`${data.shootingTime}`}
                                        onChange={(e) => updateData({ shootingTime: Number(e.target.value) })}
                                    >
                                        <MenuItem value={`0.5`}>半小时</MenuItem>
                                        <MenuItem value={`1`}>1小时</MenuItem>
                                        <MenuItem value={`2`}>2小时</MenuItem>
                                        <MenuItem value={`4`}>4小时</MenuItem>
                                        <MenuItem value={`8`}>8小时</MenuItem>
                                        <MenuItem value={`0`}>自定义</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item>
                                    {data.shootingTime === 0 ? <TextField
                                        required
                                        label="自定义时长"
                                        fullWidth
                                        size='small'
                                        placeholder='请填写拍摄时长'
                                        value={data.customShootingTime}
                                        onChange={(e) => updateData({ customShootingTime: Number(e.target.value) })}
                                    /> : null}
                                </Grid>
                                <Grid xs={4} item></Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="精修数量"
                                        fullWidth
                                        size='small'
                                        value={data.refineCount}
                                        onChange={(e) => updateData({ refineCount: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="拍摄场景"
                                        fullWidth
                                        size='small'
                                        select
                                        value={(`${Number(data.shootingIndoor)}`)}
                                        onChange={(e) => updateData({ shootingIndoor: !!Number(e.target.value) })}
                                    >
                                        <MenuItem value={`1`}>内景</MenuItem>
                                        <MenuItem value={`0`}>外景</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item>
                                    {data.shootingIndoor ? <TextField
                                        required
                                        label="内景数量"
                                        fullWidth
                                        size='small'
                                        value={data.shootingSceneIndoorCount}
                                        onChange={(e) => updateData({ shootingSceneIndoorCount: Number(e.target.value) })}
                                    /> : null}
                                </Grid>
                            </Grid>
                        </Item>
                    ) : null
                }
                <TextField
                    required
                    label="自定义服务详情"
                    fullWidth
                    size='small'
                    rows={9}
                    multiline
                    placeholder="【拍摄服务】&#10;可拍摄两次&#10;提供专业服装店内任选（可定制）并赠送服装一套&#10;【贴心服务】&#10;1：专业摄影师一对一服务&#10;2：全程摄影师，引导师全程跟拍&#10;3：免费享受首页影棚拍摄或者外景拍摄，可上门定制拍摄&#10;【尊贵享受】&#10;40张精修片，方10寸相册一本，入册24张底片（12p精修时尚设计）&#10;
                    "
                    value={data.customDetail}
                    onChange={(e) => updateData({ customDetail: e.target.value })}
                />
            </Stack>
        </Item>
    )
}

export default React.memo(SampleService);