import Stack from '@mui/material/Stack';
import React from 'react';
import { Item } from './item';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { SampleData, SampleTemplate } from 'declare/sample';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Template from './components/template';
import { useSampleCreateStore } from './store';

const SampleService = ({
    data,
    updateData,
}: {
    data: SampleData;
    updateData: (data: Partial<SampleData>) => void;
}) => {
    const templateState = useSampleCreateStore(state => state.templateState);
    const tempData = templateState.curTemp
    const updateTemplateState = useSampleCreateStore(state => state.updateTemplateState);
    let showData: SampleData;
    const update = React.useRef(updateData);
    const updateTemp = React.useCallback((data: Partial<SampleTemplate>) => {
        updateTemplateState({ curTemp: Object.assign({}, tempData, data) })
    }, [tempData])
    if (tempData) {
        showData = tempData as SampleData
        update.current = updateTemp;
    } else {
        showData = data
        update.current = updateData;
    }
    return (
        <Item>
            <Stack spacing={2}>
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    服务内容
                    <Template />
                </Typography>
                <FormControl >
                    <FormLabel>基础服务内容</FormLabel>
                    <RadioGroup
                        row
                        value={`${Number(showData.basicInfoVisible)}`}
                        onChange={(e) => update.current({ basicInfoVisible: !!Number(e.target.value) })}
                    >
                        <FormControlLabel value={`1`} control={<Radio />} label="显示信息" />
                        <FormControlLabel value={`0`} control={<Radio />} label="暂不显示" />
                    </RadioGroup>
                </FormControl>
                {
                    showData.basicInfoVisible ? (
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
                                        value={showData.costumeOffer ? '1' : '0'}
                                        onChange={(e) => update.current({ costumeOffer: !!Number(e.target.value) })}
                                    >
                                        <MenuItem value={`0`}>不提供</MenuItem>
                                        <MenuItem value={`1`}>提供</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item>
                                    {showData.costumeOffer ? <TextField
                                        required
                                        label="服装套数"
                                        fullWidth
                                        size='small'
                                        select
                                        value={`${showData.costumeCount}`}
                                        onChange={(e) => update.current({ costumeCount: Number(e.target.value) })}
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
                                    {showData.costumeCount === 0 ? <TextField
                                        required
                                        label="自定义套数"
                                        fullWidth
                                        size='small'
                                        placeholder='请填写套系数量'
                                        value={`${showData.customCostumeCount}`}
                                        onChange={(e) => update.current({ customCostumeCount: Number(e.target.value) })}
                                    /> : null}
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="底片数量"
                                        fullWidth
                                        size='small'
                                        value={`${showData.negativeFilmCount}`}
                                        onChange={(e) => update.current({ negativeFilmCount: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="底片全送"
                                        fullWidth
                                        size='small'
                                        select
                                        value={showData.negaFilmAllOffer ? '1' : '0'}
                                        onChange={(e) => update.current({ negaFilmAllOffer: !!Number(e.target.value) })}
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
                                        value={`${showData.shootingTime}`}
                                        onChange={(e) => update.current({ shootingTime: Number(e.target.value) })}
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
                                    {showData.shootingTime === 0 ? <TextField
                                        required
                                        label="自定义时长"
                                        fullWidth
                                        size='small'
                                        placeholder='请填写拍摄时长'
                                        value={`${showData.customShootingTime}`}
                                        onChange={(e) => update.current({ customShootingTime: Number(e.target.value) })}
                                    /> : null}
                                </Grid>
                                <Grid xs={4} item></Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="精修数量"
                                        fullWidth
                                        size='small'
                                        value={`${showData.refineCount}`}
                                        onChange={(e) => update.current({ refineCount: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid xs={4} item>
                                    <TextField
                                        required
                                        label="拍摄场景"
                                        fullWidth
                                        size='small'
                                        select
                                        value={(`${Number(showData.shootingIndoor)}`)}
                                        onChange={(e) => update.current({ shootingIndoor: !!Number(e.target.value) })}
                                    >
                                        <MenuItem value={`1`}>内景</MenuItem>
                                        <MenuItem value={`0`}>外景</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid xs={4} item>
                                    {showData.shootingIndoor ? <TextField
                                        required
                                        label="内景数量"
                                        fullWidth
                                        size='small'
                                        value={`${showData.shootingSceneIndoorCount}`}
                                        onChange={(e) => update.current({ shootingSceneIndoorCount: Number(e.target.value) })}
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