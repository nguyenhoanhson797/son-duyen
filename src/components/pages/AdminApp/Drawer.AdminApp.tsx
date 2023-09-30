import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { OpenFormDrawerType } from './AdminAppLayout';
import { GuestType, appService } from '../../../constants/services';
import { SaveOutlined } from '@ant-design/icons'
import { axiosServiceCheck } from '../../../constants/axios-service-check';

interface IProps {
    openFormDrawer: OpenFormDrawerType | undefined
    setOpenFormDrawer: React.Dispatch<React.SetStateAction<OpenFormDrawerType | undefined>>
    handleCallService: () => void
    setData: React.Dispatch<React.SetStateAction<GuestType[] | undefined>>
}

const requireMark = <span style={{color: 'red'}}>*</span>

const DrawerAdminApp = ({
    openFormDrawer,
    setOpenFormDrawer,
    handleCallService,
    setData
}: IProps) => {
    const [form] = Form.useForm<GuestType>()

    const [isLoading, setIsLoading] = useState(false)

    const getDrawerTitle = () => {
        switch(openFormDrawer?.action){
            case 'create':
                return 'Thêm khách mời'
            case 'edit':
                return 'Chỉnh sửa thông tin'
        }
    }

    const handleCreate = (value: GuestType) => {
        setIsLoading(true)
        appService().postKhachMoi(value)
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        message.success('Đã thêm khách mời')
                        setData((prev) => prev ? [res.data, ...prev] : [res.data])
                        setOpenFormDrawer(undefined)
                    }
                })
            })
            .finally(() => setIsLoading(false))
    }

    const handleUpdate = (value: GuestType) => {
        if(!openFormDrawer || !openFormDrawer.data){
            return message.error('Hành động thất bại')
        }
        const id = openFormDrawer.data.Id

        setIsLoading(true)
        appService().patchKhachMoi(id, value)
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        message.success('Đã chỉnh sửa thông tin')
                        handleCallService()
                        setOpenFormDrawer(undefined)
                    }
                })
            })
            .finally(() => setIsLoading(false))
    }

    const onSubmit = (value: GuestType) => {
        switch(openFormDrawer?.action){
            case 'edit':
                handleUpdate(value)
                break;
            case 'create':
                handleCreate(value)
                break;
        }
    }

    useEffect(() => {
        if(openFormDrawer && openFormDrawer.data){
            form.setFieldsValue(openFormDrawer.data)
        } else {
            form.resetFields()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openFormDrawer])
    
    return (
        <Drawer
            open={!!openFormDrawer}
            onClose={() => setOpenFormDrawer(undefined)}
            title={getDrawerTitle()}
        >
            <Form
                name='info'
                form={form}
                onFinish={onSubmit}
            >   
                <Space direction='vertical' style={{width: '100%'}} size={12} >
                    <Row gutter={[6,6]}>
                        <Col span={24} >
                            {requireMark} Tên khách mời:
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='name'
                                rules={[{required: true, message: 'Đây là trường bắt buộc'}]}
                                style={{margin: 0}}
                            >
                                <Input placeholder='nhập tên' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[6,6]}>
                        <Col span={24} >
                            Số điện thoại:
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='phone'
                                style={{margin: 0}}
                            >
                                <InputNumber 
                                    controls={false} 
                                    placeholder='nhập số điện thoại' 
                                    addonBefore={'+84'} 
                                    style={{width: '100%'}}    
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[6,6]}>
                        <Col span={24} >
                            Email:
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='email'
                                style={{margin: 0}}
                            >
                                <Input placeholder='nhập email' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[6,6]}>
                        <Col span={24} >
                            Ghi chú:
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='note'
                                style={{margin: 0}}
                            >
                                <Input.TextArea placeholder='Điền ghi chú' autoSize={{minRows: 2}} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={'end'} style={{marginTop: 20}} >
                        <Col>
                            <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={isLoading} >
                                Lưu
                            </Button>
                        </Col>
                    </Row>
                </Space>
            </Form>
        </Drawer>
    );
};

export default DrawerAdminApp;