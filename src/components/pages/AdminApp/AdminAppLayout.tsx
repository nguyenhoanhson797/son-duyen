import React, { useEffect, useState } from 'react';
import { Card, Button, Spin, Space } from 'antd';
import { GuestType, appService } from '../../../constants/services';
import { axiosServiceCheck } from '../../../constants/axios-service-check';
import DrawerAdminApp from './Drawer.AdminApp';
import { PlusOutlined } from '@ant-design/icons'
import { useWindowSize } from '../../../constants/window-size-hook';
import { searchQuery } from '../../../constants/services';
import { debounce } from 'lodash';
import TableAdminApp from './Table.AdminApp';
import SearchButtons from './SearchButtons';

export interface OpenFormDrawerType{
    action: 'create' | 'edit'
    data?: GuestType,
}

const mirrorStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(5px)',
    border: 'none'
}

const AdminAppLayout = () => {
    const [data, setData] = useState<GuestType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [openFormDrawer, setOpenFormDrawer] = useState<OpenFormDrawerType | undefined>(undefined)

    const windowSize = useWindowSize()
    const isSmallSize = windowSize.width && windowSize.width <= 800

    const handleCallService = (query?: searchQuery) => {
        setIsLoading(true)
        appService().getListKhachMoi(query)
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        setData(res.data.data)
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const debounceGetRequestTypeData = debounce((value: string | undefined) => {
        if(!value){
            handleCallService()
            return
        }

        handleCallService({name: value})
    }, 500, {maxWait: 800})

    function getGuestData (value: string | undefined) {
        debounceGetRequestTypeData(value)
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
                maxWidth: '100vw',
                height: '100vh',
                backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/background-app.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Card
                title={'Danh sách'}
                size={isSmallSize ? 'small' : undefined}
                style={{
                    width: isSmallSize ? '100vw' : undefined,
                    margin: 20,
                    ...mirrorStyle
                }}
                extra={
                    <Space size={4}>
                        <SearchButtons
                            collapse={isSmallSize ? true : false}
                            sizeBreakpoint={800}
                            Props={{
                                onSearch: (value) => {
                                    if(value.trim().length === 0){
                                        return
                                    }
                                    handleCallService({name: value})
                                },
                                onChange: (x) => getGuestData(x.target.value),
                            }}
                        />

                        <Button
                            type='primary'
                            onClick={() => setOpenFormDrawer({
                                action: 'create'
                            })}
                            icon={<PlusOutlined />}
                            size={isSmallSize ? 'small' : undefined}
                        >
                            {isSmallSize ? (
                                'Thêm'
                            ) : (
                                'Thêm khách mời'
                            )}
                        </Button>
                    </Space>
                }
            >
                <Spin
                    delay={300}
                    tip='Đang tải dữ liệu'
                    spinning={isLoading}
                >
                    <TableAdminApp
                        data={data}
                        setData={setData}
                        setIsLoading={setIsLoading}
                        handleCallService={handleCallService}
                        setOpenFormDrawer={setOpenFormDrawer}
                    />
                </Spin>
            </Card>

            <DrawerAdminApp
                openFormDrawer={openFormDrawer}
                setOpenFormDrawer={setOpenFormDrawer}
                handleCallService={handleCallService}
            />
        </div>
    );
};

export default AdminAppLayout;