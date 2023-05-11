import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GuestType, appService } from '../constants/services';
import { Button, Card, Carousel, Empty, FloatButton, Modal, Space, Spin, Typography, message } from 'antd';
import { axiosServiceCheck } from '../constants/axios-service-check';
import { CarouselRef } from 'antd/es/carousel';
import { BookOutlined, AudioMutedOutlined, AudioOutlined } from '@ant-design/icons'
import Sound, { ReactSoundProps } from 'react-sound';


const { Title } = Typography

const mirrorStyle: React.CSSProperties = {
    background: "linear-gradient(to bottom, rgba(140,140,140,0.5) 0%,rgba(140,140,140,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(5px)',
    border: 'none'
}

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '240px',
    // color: '#C3C3C3',
    // lineHeight: '160px',
    textAlign: 'center',
    border: 'none',
    backgroundColor: '#e0cc907a'
};

const musicLinks = [
    'https://archive.org/download/music_20230511/music-1.mp3',
    'https://archive.org/download/music_20230511/music-2.mp3',
    'https://archive.org/download/music_20230511/music-3.mp3',
    'https://archive.org/download/music_20230511/music-4.mp3',
    'https://archive.org/download/music_20230511/music-5.mp3',
    'https://archive.org/download/music_20230511/music-6.mp3'
]
  

const InviteCard = () => {
    const { khachMoiId } = useParams()
    const ref = useRef<any>(null)

    const [data, setData] = useState<GuestType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [musicPlaying, setMusicPlaying] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const handleCallService = () => {
        if(!khachMoiId){
            return(
                <Empty description={'Không tìm thấy dữ liệu'} />
            )
        }

        setIsLoading(true)
        appService().getListKhachMoi()
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        setData(res.data.data)
                        message.success(`Xin chào ${res?.data?.data?.find(x => x.id === khachMoiId)?.name}`)
                        setOpenModal(true)
                    }
                })
            })
            .finally(() => setIsLoading(false))
    }

    const handleEnded = () => {
        setIsPlaying(false)
        let next = musicPlaying + 1
        if(next >= 6){
            next = 0
        }
        setMusicPlaying(next)
        setIsPlaying(true)
    }

    useEffect(() => {
        handleCallService()
    }, [])

    return (
        <Spin spinning={isLoading} delay={300} size='large' >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '100vw',
                    height: '100vh',
                    backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/img@main/background-app-2.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Modal
                    open={openModal}
                    footer={false}
                    closable={false}
                    style={{ width: 600 }}
                    maskStyle={mirrorStyle}
                >
                    <Card
                        bodyStyle={{margin: 0, padding: 0}}
                        cover={
                            <img 
                                alt="img" 
                                src="https://cdn.jsdelivr.net/gh/nguyenhoanhson797/img@main/background-app-4.jpg"
                            />
                        }            
                    >
                        <div>
                            <Space style={{...contentStyle, width: '100%', justifyContent: 'space-between'}} direction='vertical' align='center' >
                                <h3>Trân trọng kính mời</h3>
                                <h1>{data?.find(x => x.id === khachMoiId)?.name}</h1>
                                <Button onClick={() => {
                                    setOpenModal(false)
                                    setOpenModal2(true)
                                    setIsPlaying(true)
                                }} >
                                    Tiếp tục
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Modal>

                <Modal
                    open={openModal2}
                    footer={false}
                    closable={false}
                    onCancel={() => setOpenModal2(false)}
                    style={{ width: 600 }}
                    maskStyle={mirrorStyle}
                >
                    <Card
                        bodyStyle={{margin: 0, padding: 0}}   
                    >
                        <Carousel>
                            <div>
                                <Space style={{...contentStyle, width: '100%'}} direction='vertical' align='center' >
                                    <h3>Trân trọng kính mời</h3>
                                    <h1>{data?.find(x => x.id === khachMoiId)?.name}</h1>
                                </Space>
                            </div>

                            <div>
                                <Space style={{...contentStyle, width: '100%'}} direction='vertical' align='center' >
                                    <h3>Đến với bữa tiệc</h3>
                                    <h3>Tại nhà hàng Hoàng Long vào lúc ...</h3>
                                </Space>
                            </div>
                        </Carousel>
                    </Card>
                </Modal>

                <FloatButton
                    shape="circle"
                    style={{ right: 24, bottom: 100 }}
                    icon={isPlaying ? <AudioMutedOutlined /> : <AudioOutlined />}
                    onClick={() => setIsPlaying(!isPlaying)}
                />

                <FloatButton
                    shape="circle"
                    type="primary"
                    style={{ right: 24 }}
                    icon={<BookOutlined />}
                    onClick={() => setOpenModal2(true)}
                />

                <Sound
                    ref={ref}
                    url={musicLinks[musicPlaying]}
                    playStatus={isPlaying ? 'PLAYING' : 'PAUSED'}
                    onFinishedPlaying={handleEnded}
                    autoLoad={true}
                />
            </div>
        </Spin>
    );
};

export default InviteCard;