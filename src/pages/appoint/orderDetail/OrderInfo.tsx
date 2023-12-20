import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import styles from './index.module.scss';
import { Schedule, PayStatus } from 'declare/schedule';
import { Swiper, SwiperSlide } from 'swiper/react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Typography from '@mui/material/Typography';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import RoomIcon from '@mui/icons-material/Room';
import PeopleIcon from '@mui/icons-material/People';
import TimelapseIcon from '@mui/icons-material/Timelapse';

const OrderInfo = ({
    data,
    openEditDialog
}: {
    data: Schedule;
    openEditDialog: () => void;
}) => {
    const {
        executors, customer, shootDate, startTime, deposit,
        price, payStatus, location, createdAt, user,
        sample: {
            covers, name: sampleName, shootingTime, negaFilmAllOffer, costumeOffer,
            costumeCount, negativeFilmCount, refineCount, shootingIndoor, shootingSceneIndoorCount
        }
    } = data;
    console.log(data)
    return (
        <Paper className={styles.orderInfo}>
            <Box className={styles.header}>
                <Box className={styles.customerInfo}>
                    <Tooltip title={customer.name}>
                        <Avatar
                            className={styles.avatar}
                            src={customer?.avatar}
                        >{customer?.avatar || customer.name.charAt(0)}
                        </Avatar>
                    </Tooltip>
                    <Box>
                        <Typography variant='h6'>{customer.name}</Typography>
                        <Typography variant='body2'>{customer.phone}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Button variant="outlined" onClick={openEditDialog}>编辑订单</Button>
                </Box>
            </Box>
            <Box className={styles.body}>
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    className={styles.covers}
                    pagination={{ clickable: true }}
                >
                    {JSON.parse(covers as any).map(url => (
                        <SwiperSlide key={url}><img src={url} /></SwiperSlide>
                    ))}
                </Swiper>
                <Grid container className={styles.basicInfo}>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <AssignmentLateIcon />
                        <Typography>套系名称：{sampleName}</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <AccessTimeIcon />
                        <Typography>拍摄时间：{dayjs(shootDate).format('YYYY-MM-DD')} {dayjs(startTime, 'hh:mm:a').format('hh:mm:ss')}</Typography>
                    </Grid>
                    <Grid item xs={6} className={styles.basicInfoItem}>
                        <CurrencyYenIcon />
                        <Typography>价格：￥{price}</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <CurrencyYenIcon />
                        <Typography>定金：￥{deposit}</Typography>
                        <Chip
                            size="small"
                            color="primary"
                            label={payStatus === PayStatus['未付款'] ? '未结算' : '已收取'}
                            sx={{ marginLeft: '10px' }}
                        />
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <RoomIcon />
                        <Typography>拍摄地址：{location}</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <TimelapseIcon />
                        <Typography>拍摄时长：{shootingTime}h</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <TimelapseIcon />
                        <Typography>创建时间：{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <PeopleIcon />
                        <Typography>创建人：{user.showName}</Typography>
                    </Grid>
                    <Grid className={styles.basicInfoItem} item xs={6}>
                        <PeopleIcon />
                        <Typography>执行人：</Typography>
                        <AvatarGroup>{executors.map(e =>
                            <Tooltip title={e.showName}>
                                <Avatar key={e.id} src={e.avatar}>{e?.avatar || e.showName.charAt(0)}</Avatar>
                            </Tooltip>)}
                        </AvatarGroup>

                    </Grid>
                    <Grid className={styles.serviceInfo} item container xs={12}>
                        <Grid className={styles.serviceItem} item xs={3}>提供服装：{costumeOffer ? '是' : '否'}</Grid>
                        {costumeOffer ? <Grid className={styles.serviceItem} item xs={3}>服装套数：{costumeCount}</Grid> : null}
                        <Grid className={styles.serviceItem} item xs={3}>底片数量：{negativeFilmCount}</Grid>
                        <Grid className={styles.serviceItem} item xs={3}>底片全送：{negaFilmAllOffer ? '是' : '否'}</Grid>
                        <Grid className={styles.serviceItem} item xs={3}>精修数量：{refineCount}</Grid>
                        <Grid className={styles.serviceItem} item xs={3}>拍摄场景：{shootingIndoor ? '内景' : '外景'}</Grid>
                        {shootingIndoor ? <Grid className={styles.serviceItem} item xs={3}>内景数量：{shootingSceneIndoorCount}</Grid> : null}
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default React.memo(OrderInfo);
