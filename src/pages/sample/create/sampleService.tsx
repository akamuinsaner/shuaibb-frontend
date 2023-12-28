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
import { Form } from 'components/FormValidator';
import { STANDARD_INTEGER, STANDARD_NUMBER } from 'common/rexps';
import { formInstance } from 'components/FormValidator/form';

export const templateValidateFields = [
    'basicInfoVisible',
    'costumeOffer',
    'costumeCount',
    'customCostumeCount',
    'negativeFilmCount',
    'negaFilmAllOffer',
    'shootingTime',
    'customShootingTime',
    'refineCount',
    'shootingIndoor',
    'shootingSceneIndoorCount',
]


const SampleService = React.forwardRef(({
    fields,
    form
}: {
    fields: Partial<SampleData>;
    form: formInstance
}, ref: any) => {
    const templateState = useSampleCreateStore(state => state.templateState);
    const tempData = templateState.curTemp
    console.log(tempData)
    React.useEffect(() => {
        if (!tempData) return;
        const { id, name, user, userId, ...updateData } = tempData;
        form.setValues(updateData);
    }, [tempData])
    return (
        <Item ref={ref}>
            <Stack spacing={2}>
                <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    服务内容
                    <Template form={form} />
                </Typography>
                <Form.Item
                    name="basicInfoVisible"
                >
                    {({ value, onChange }) => (<FormControl >
                        <FormLabel>基础服务内容</FormLabel>
                        <RadioGroup
                            row
                            value={value ? '1' : '0'}
                            onChange={(e) => onChange(!!Number(e.target.value))}
                        >
                            <FormControlLabel value={`1`} control={<Radio />} label="显示信息" />
                            <FormControlLabel value={`0`} control={<Radio />} label="暂不显示" />
                        </RadioGroup>
                    </FormControl>)}
                </Form.Item>
                <Item sx={{
                    overflow: 'hidden',
                    height: fields.basicInfoVisible ? 'auto' : 0,
                    padding: fields.basicInfoVisible ? '20px' : 0
                }}>
                    <Grid
                        spacing={2}
                        container
                    >
                        <Grid xs={4} item>
                            <Form.Item
                                name="costumeOffer"
                                rules={[{ required: true, msg: '请选择是否提供服装造型' }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label="服装造型"
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={0}>不提供</MenuItem>
                                    <MenuItem value={1}>提供</MenuItem>
                                </TextField>)}

                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item>
                            {fields.costumeOffer ? <Form.Item
                                name="costumeCount"
                                rules={[{ required: true, msg: '请选择是否提供服装套数' }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label="服装套数"
                                    select
                                    value={value}
                                    onChange={(e) => onChange(Number(e.target.value))}
                                >
                                    <MenuItem value={1}>1套</MenuItem>
                                    <MenuItem value={2}>2套</MenuItem>
                                    <MenuItem value={3}>3套</MenuItem>
                                    <MenuItem value={4}>4套</MenuItem>
                                    <MenuItem value={5}>5套</MenuItem>
                                    <MenuItem value={0}>自定义</MenuItem>
                                </TextField>)}
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item>
                            {(`${fields.costumeCount}` === '0' && fields.costumeOffer) ? <Form.Item
                                name="customCostumeCount"
                                rules={[
                                    { required: true, msg: '请输入底片数量' },
                                    { regex: STANDARD_INTEGER, msg: '请输入标准格式的整数' }
                                ]}
                            >
                                <TextField
                                    label="自定义套数"
                                    placeholder='请填写套系数量'
                                />
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="negativeFilmCount"
                                rules={[
                                    { required: true, msg: '请输入底片数量' },
                                    { regex: STANDARD_INTEGER, msg: '请输入标准格式的整数' }
                                ]}
                            >
                                <TextField label="底片数量" />
                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="negaFilmAllOffer"
                                rules={[{ required: true, msg: '请选择是否底片全送' }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label="底片全送"
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={0}>否</MenuItem>
                                    <MenuItem value={1}>是</MenuItem>
                                </TextField>)}
                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item></Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="shootingTime"
                                rules={[{ required: true, msg: '请选择拍摄时长' }]}
                            >
                                <TextField label="拍摄时长" select>
                                    <MenuItem value={0.5}>半小时</MenuItem>
                                    <MenuItem value={1}>1小时</MenuItem>
                                    <MenuItem value={2}>2小时</MenuItem>
                                    <MenuItem value={4}>4小时</MenuItem>
                                    <MenuItem value={8}>8小时</MenuItem>
                                    <MenuItem value={0}>自定义</MenuItem>
                                </TextField>
                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            {`${fields.shootingTime}` === '0' ? <Form.Item
                                name="customShootingTime"
                                rules={[
                                    { required: true, msg: '请输入底片数量' },
                                    { regex: STANDARD_NUMBER, msg: '请输入标准格式的数字' }
                                ]}
                            >
                                <TextField label="自定义时长" />
                            </Form.Item> : null}
                        </Grid>
                        <Grid xs={4} item></Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="refineCount"
                                rules={[
                                    { required: true, msg: '请输入底片数量' },
                                    { regex: STANDARD_INTEGER, msg: '请输入标准格式的整数' }
                                ]}
                            >
                                <TextField label="精修数量" />
                            </Form.Item>

                        </Grid>
                        <Grid xs={4} item>
                            <Form.Item
                                name="shootingIndoor"
                                rules={[{ required: true, msg: '请选择拍摄场景' }]}
                            >
                                {({ value, onChange }) => (<TextField
                                    label="拍摄场景"
                                    select
                                    value={typeof value === 'boolean' ? (value ? 1 : 0) : ''}
                                    onChange={(e) => onChange(!!Number(e.target.value))}
                                >
                                    <MenuItem value={1}>内景</MenuItem>
                                    <MenuItem value={0}>外景</MenuItem>
                                </TextField>)}

                            </Form.Item>
                        </Grid>
                        <Grid xs={4} item>
                            {fields.shootingIndoor ? <Form.Item
                                name="shootingSceneIndoorCount"
                                rules={[
                                    { required: true, msg: '请填写内景数量' },
                                    { regex: STANDARD_INTEGER, msg: '请输入标准格式的整数' }
                                ]}
                            >
                                <TextField label="内景数量" />
                            </Form.Item> : null}
                        </Grid>
                    </Grid>
                </Item>
                <Form.Item
                    name="customDetail"
                >
                    <TextField
                        label="自定义服务详情"
                        rows={9}
                        multiline
                        placeholder="【拍摄服务】&#10;可拍摄两次&#10;提供专业服装店内任选（可定制）并赠送服装一套&#10;【贴心服务】&#10;1：专业摄影师一对一服务&#10;2：全程摄影师，引导师全程跟拍&#10;3：免费享受首页影棚拍摄或者外景拍摄，可上门定制拍摄&#10;【尊贵享受】&#10;40张精修片，方10寸相册一本，入册24张底片（12p精修时尚设计）&#10;
                    "
                    />
                </Form.Item>

            </Stack>
        </Item>
    )
})

export default SampleService;