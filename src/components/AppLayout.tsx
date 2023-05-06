import React, { useEffect, useState } from 'react';
import { message, Card, Button, Spin } from 'antd';
import { GuestType, appService } from '../constants/services';
import { axiosServiceCheck } from '../constants/axios-service-check';
import TableApp from './Table.App';
import DrawerApp from './Drawer.App';

export interface OpenFormDrawerType{
    action: 'create' | 'edit'
    data?: GuestType,
}

const AppLayout = () => {
    const [data, setData] = useState<GuestType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [openFormDrawer, setOpenFormDrawer] = useState<OpenFormDrawerType | undefined>(undefined)

    const handleCallService = () => {
        setIsLoading(true)
        appService().getListKhachMoi()
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        message.success('Lấy dữ liệu thành công')
                        setData(res.data.data)
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        handleCallService()
    }, [])

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
                        onClick={() => setOpenFormDrawer({
                            action: 'create'
                        })}
                    >
                        Thêm khách mời
                    </Button>
                }
            >
                <Spin
                    delay={300}
                    tip='Đang tải dữ liệu'
                    spinning={isLoading}
                >
                    <TableApp
                        data={data}
                        setData={setData}
                        setIsLoading={setIsLoading}
                        handleCallService={handleCallService}
                        setOpenFormDrawer={setOpenFormDrawer}
                    />
                </Spin>
            </Card>

            <DrawerApp 
                openFormDrawer={openFormDrawer}
                setOpenFormDrawer={setOpenFormDrawer}
                handleCallService={handleCallService}
            />
        </div>
    );
};

export default AppLayout;