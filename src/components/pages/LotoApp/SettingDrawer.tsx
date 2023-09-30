import { Alert, Button, Col, Drawer, InputNumber, Row, Select, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import useWindowSize from '../../hooks/window-size-hook';

interface IProps {
    openSetting: boolean
    setOpenSetting: React.Dispatch<React.SetStateAction<boolean>>
    valueRange: [number, number]
    avoidValues: number[]
    setValueRange: React.Dispatch<React.SetStateAction<[number, number]>>
    setAvoidValue: React.Dispatch<React.SetStateAction<number[]>>
}

const SettingDrawer = ({ 
    openSetting, 
    setOpenSetting, 
    valueRange,
    avoidValues,
    setValueRange, 
    setAvoidValue 
}: IProps) => {
    const { isSmallSize } = useWindowSize({ options: { needWindowSize: false } })

    const [formRange, setFormRange] = useState<[number, number]>([0, 0])
    const [formAvoids, setFormAvoids] = useState<number[]>([])

    const resultArray = Array.from({ length: formRange[1] - formRange[0] + 1 }, (_, index) => formRange[0] + index)

    const onSubmit = () => {
        setValueRange(() => formRange)
        setAvoidValue(() => formAvoids)
        setOpenSetting(() => false)
        message.success('Đã lưu cài đặt')
    }

    useEffect(() => {
        if (openSetting) {
            setFormRange(() => valueRange)
        }
    }, [openSetting, valueRange])

    useEffect(() => {
        if (openSetting) {
            setFormAvoids(() => avoidValues)
        }
    }, [openSetting, avoidValues])
    
    return (
        <Drawer 
            open={openSetting} 
            onClose={() => setOpenSetting(false)} 
            title="Cài đặt quay số" 
            width={isSmallSize ? '100%' : undefined}
        >
            <Row gutter={[12, 12]} style={{ width: '100%' }}>
                <Alert
                    message="Giá trị tối đa của vòng quay là 3 chữ số"
                    type="info"
                    showIcon
                    style={{ width: '100%' }}
                />
                <Col span={24}>
                    Chọn khoảng giá trị
                </Col>

                <Col span={6}>
                    Từ:
                </Col>
                <Col span={18}>
                    <InputNumber
                        min={0}
                        max={formRange[1] >= 999 ? 999 : formRange[1]}
                        value={formRange[0]} 
                        onChange={(value) => setFormRange([value || 0, formRange[1]])}
                        style={{ width: '100%'}}
                    />
                </Col>

                <Col span={6}>
                    Đến:
                </Col>
                <Col span={18}>
                    <InputNumber
                        min={formRange[0]}
                        max={999}
                        value={formRange[1]} 
                        onChange={(value) => setFormRange([formRange[0], value || 0])}
                        style={{ width: '100%'}}
                    />
                </Col>

                <Col span={24}>
                    Các số loại trừ
                </Col>

                <Col span={24}>
                    <Select 
                        mode='multiple'
                        value={formAvoids}
                        onChange={(value) => setFormAvoids(value)}
                        showSearch
                        options={resultArray.map(item => (
                            {
                                value: item,
                                key: item,
                                label: item,
                            }
                        ))}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>

            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button danger type='primary' onClick={() => setOpenSetting(false)}>
                    Hủy
                </Button>
                <Button type='primary' onClick={onSubmit}>
                    Áp dụng
                </Button>
            </Space>
        </Drawer>
    );
};

export default SettingDrawer;