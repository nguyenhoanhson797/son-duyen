import React, { useEffect, useState } from 'react';
import { message, Card, Button } from 'antd';
import { GuestType, appService } from '../constants/services';
import { axiosServiceCheck } from '../constants/axios-service-check';

const AppLayout = () => {
    const [data, setData] = useState<GuestType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)

    const handleCallService = () => {
        setIsLoading(true)
        appService().getListKhachMoi()
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        message.success('Lấy dữ liệu thành công')
                        console.log(res);
                        setData(res.data.data)
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh'
            }}
        >
            <Card
                title='Danh sách'
                extra={
                    <Button
                        type='primary'
                        onClick={() => handleCallService()}
                    >
                        Lấy dữ liệu
                    </Button>
                }
            >
                
            </Card>
        </div>
    );
};

export default AppLayout;