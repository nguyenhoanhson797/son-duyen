import { CSSProperties, useState } from 'react';
import { useWindowSize } from '../../hooks/window-size-hook';
import { Button, Col, FloatButton, Modal, Row, Space, Typography, theme } from 'antd';
import { allFontName } from '../../font/use-font';
import { CloseOutlined } from '@ant-design/icons'

const mirrorStyle: CSSProperties = {
    background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(5px)',
    border: 'none'
}

const { useToken } = theme
const { Text } = Typography

const GiftPage = () => {
    const windowSize = useWindowSize()
    const isMobileSize = windowSize.width && windowSize.width <= 576

    const themeToken = useToken().token

    const [open, setOpen] = useState(false)

    const backgroundStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1.43,
        width: '100%',
        maxWidth: '96vw',
        height: 'auto',
        backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/background-gift.jpg')`,
        backgroundSize: (isMobileSize ? 'contain' : 'cover'),
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative'
    }

    const getBackgroundStyle = (url: string): CSSProperties => {
        return {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 1,
          width: isMobileSize ? 140 : 200,
          height: '100%',
          backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/${url}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
        }
      }

    return (
        <>
            <div style={backgroundStyle}>
                <div
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: 200, 
                        height: 120,
                        borderRadius: 12,
                        ...mirrorStyle
                    }}
                >
                    <Button 
                        type='primary'
                        onClick={() => setOpen(true)}
                        style={{ backgroundColor: themeToken['cyan-6' ], ...allFontName.fontCharm, fontSize: 16 }}
                    >
                        Gửi quà
                    </Button>
                </div>
            </div>

            <Modal open={open} onCancel={() => setOpen(false)} footer={false}>
                <Space 
                    size={12} 
                    style={{ 
                        justifyContent: 'space-between', 
                        padding: '20px 12px', 
                        width: '100%', 
                        flexDirection: 'column', 
                        alignItems: 'center' ,
                        boxSizing: 'border-box',
                    }}
                >
                    <div style={getBackgroundStyle('qr-gift.png')} />
                    <Row gutter={[20, 0]} style={{ padding: isMobileSize ? undefined : '20px 40px'}}>
                        <Col xs={24} lg={8}>
                            <Text>
                                Số tài khoản:
                            </Text>
                        </Col>
                        <Col xs={24} lg={16}>
                            <Text strong style={{ color: themeToken['geekblue-5'] }}>
                                17418427
                            </Text>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Text>
                                Tên chủ tài khoản:
                            </Text>
                        </Col>
                        <Col xs={24} lg={16}>
                            <Text strong style={{ color: themeToken['geekblue-5'] }}>
                                NGUYEN HOANH SON
                            </Text>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Text>
                                Ngân hàng:
                            </Text>
                        </Col>
                        <Col xs={24} lg={16}>
                            <Text strong style={{ color: themeToken['geekblue-5'] }}>
                                ACB - Ngân hàng thương mại cổ phần Á Châu
                            </Text>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Text>
                                Chi nhánh:
                            </Text>
                        </Col>
                        <Col xs={24} lg={16}>
                            <Text strong style={{ color: themeToken['geekblue-5'] }}>
                                ACB - CN TAN CHANH HIEP
                            </Text>
                        </Col>
                    </Row>
                </Space>
            </Modal>

            <FloatButton
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => setOpen(false)}
                type='default'
                style={{ right: 24, display: open ? '' : 'none', zIndex: 99999}}
            />
        </>
    )
}

export default GiftPage