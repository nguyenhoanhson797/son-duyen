import { CSSProperties, useEffect, useState } from 'react';
import { GuestType, WishesType, appService, updateGuestTypeDto } from '../../../constants/services';
import { axiosServiceCheck } from '../../../constants/axios-service-check';
import { Space, Spin, message, Input, Button, theme, Card, Typography } from 'antd';
import useWindowSize from '../../hooks/window-size-hook';
import { allFontName } from '../../font/use-font';

interface IProps {
    userData: GuestType | undefined
}

const { useToken } = theme
const { Text } = Typography

const spaceStyle: CSSProperties = {
    width: '100%',
    maxWidth: '96vw',
    aspectRatio: 0.719,
    height: 'auto',
    backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/background-wishes.jpg')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    filter: 'blur(5px)',
    position: 'relative',
}

const contentStyle: CSSProperties = {
    width: '100%', 
    padding: 20, 
    boxSizing: 'border-box', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    aspectRatio: 0.719, 
    height: 'auto'
}

const WishesPage = ({ userData }: IProps) => {
    const themeToken = useToken().token
    const { isSmallSize } = useWindowSize({ options: { needWindowSize: false } })

    const [data, setData] = useState<WishesType[] | undefined>(undefined)
    const [wishes, setWishes] = useState<string | undefined>('Chúc Sơn và Duyên hạnh phúc!')
    const [isLoading, setIsLoading] = useState(false)

    const [realData, setRealData] = useState<string | undefined>(undefined)

    const handleCallService = () => {
        setIsLoading(true)
        appService().getListLoiChuc()
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        setData(res.data.data)
                        setRealData(res.data.data.find(x => x.id === userData?.id)?.wishes)
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleAddWishes = () => {
        if (!wishes || !userData) {
            message.error('Hành động thất bại')
            return
        }
        const body: updateGuestTypeDto = {
            name: userData.name,
            email: userData.email,
            note: userData.note,
            phone: userData.phone
        }
        setIsLoading(true)
        appService().patchLoiChucKhachMoi(userData.id, body, wishes)
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        setRealData(res.data.wishes)
                        handleCallService()
                    }
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        const targetData = data?.find(x => x.id === userData?.id )
        if (userData && data && targetData) {
            const newData = data.filter(x => x.id !== userData.id )
            setData(() => [targetData, ...newData])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realData])

    return (
        <Spin tip="Đang tải dữ liệu" spinning={isLoading} delay={300}>
            <div style={spaceStyle} />
            <Space direction='vertical' style={contentStyle} size={12}>
                <Input.TextArea
                    autoSize={{ minRows: 2 }}
                    value={wishes}
                    onChange={(x) => setWishes(x.target.value)}
                    placeholder='Gửi lời chúc'
                    allowClear
                />
                <Button type='primary' style={{ justifyItems: 'center' ,backgroundColor: themeToken['cyan-6' ]}} onClick={(() => handleAddWishes())}>
                    Gửi lời chúc
                </Button>

                <div 
                    style={{ 
                        width: '100%', 
                        height: isSmallSize ? 252 : 800, 
                        overflow: 'auto', 
                        display: 'flex', 
                        gap: 6, 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: data ? 'flex-start' : 'center', 
                    }
                }>
                    {data ? (
                        data.filter(x => x.wishes).map(item => (
                            <Card
                                size='small'
                                bordered={false}
                                key={item.id}
                                style={{ width: '100%', backgroundColor: '#fff1dfe6' }}
                            >
                                <Space size={4} direction='vertical' style={{ width: '100%' }}>
                                    <Text
                                        strong
                                        style={{ fontSize: isSmallSize ? 16 : 20, ...allFontName.fontAmatic }}
                                    >
                                            {item.name}
                                    </Text>
                                    <Text
                                        style={{ fontSize: isSmallSize ? 16 : 24, ...allFontName.fontCharm }}
                                    >
                                        {item.wishes}
                                    </Text>
                                </Space>
                            </Card>
                        ))
                    ) : (
                        <Button onClick={() => handleCallService()}>
                            Xem tất cả lời chúc
                        </Button>
                    )}
                </div>
            </Space>
        </Spin>
    );
};

export default WishesPage;