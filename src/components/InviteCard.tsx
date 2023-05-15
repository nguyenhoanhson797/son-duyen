import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GuestType, appService } from '../constants/services';
import { Button, Card, Empty, FloatButton, Modal, Space, Spin, Typography, message } from 'antd';
import { axiosServiceCheck } from '../constants/axios-service-check';
import { BookOutlined, AudioMutedOutlined, AudioOutlined, CloseOutlined } from '@ant-design/icons'
import { useWindowSize } from '../constants/window-size-hook';
import { allFontName } from './font/use-font';
import './font/font.css'
import './animation/writing.css'
import './animation/all.css'
import './animation/card.css'


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
    const ref = useRef<HTMLAudioElement>(null)
    const windowSize = useWindowSize()
    const isMobileSize = windowSize.width && windowSize.width <= 960

    const [data, setData] = useState<GuestType[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [musicPlaying, setMusicPlaying] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };


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
        console.log('end');
        let next = musicPlaying + 1
        if(next >= 6){
            next = 0
        }
        setMusicPlaying(next)
        ref.current!.load()
        console.log('start load');
    }

    useEffect(() => {
        if(isPlaying){
            ref.current!.play()
        } else {
            ref.current!.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        handleCallService()
    }, [])

    useEffect(() => {
        if(!openModal2){
            setFlipped(false)
        }
    }, [openModal2])

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
                    backgroundSize: isMobileSize ? 'contain' : 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}
            >
                <Modal
                    open={openModal}
                    footer={false}
                    closable={false}
                    style={{ width: 600 }}
                    maskStyle={mirrorStyle}
                    className='card'
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
                                <div className='typewriter1st'>
                                    <h3>Xin Chào</h3>
                                </div>
                                <div className='typewriter2nd' style={{...allFontName.fontCharm}} >
                                    <h1>{data?.find(x => x.id === khachMoiId)?.name}</h1>
                                </div>
                                <Button
                                    onClick={() => {
                                        setOpenModal(false)
                                        setOpenModal2(true)
                                        setIsPlaying(true)
                                        ref.current!.play()
                                    }}
                                    style={{marginBottom: 20}}
                                >
                                    Tiếp tục
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Modal>

                <Modal
                    open={openModal2}
                    footer={false}
                    onCancel={() => setOpenModal2(false)}
                    bodyStyle={{ padding: 0}}
                    maskStyle={mirrorStyle}
                    className='card'
                    style={{top: windowSize.width && windowSize.width <= 460 ? '10vh' : '5vh'}}
                    closable={false}
                >
                    <div
                        className={`card-container ${flipped ? 'flipped' : ''}`}
                        onClick={handleFlip}
                    >
                        <div className="card-front">
                            <div
                                style={{
                                    backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/card-f.svg')",
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    aspectRatio: '1/1.42',
                                    maxHeight: '90vh',
                                    width: 'auto',
                                    position: 'relative'
                                }}
                            >
                                 <div className="card-hint">
                                    Bấm để lật thiệp
                                </div>
                            </div>
                        </div>

                        <div className="card-back">
                            <div
                                style={{
                                    backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/card-b.svg')",
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    aspectRatio: '1/1.42',
                                    width: 'auto',
                                    maxHeight: '90vh',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute', 
                                        top: '25%', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '36%',
                                        padding: '0px 10%',
                                        boxSizing: 'border-box',
                                        flexWrap: 'wrap'
                                }}
                                >
                                    <Typography.Title 
                                        level={isMobileSize ? 3 : 1} 
                                        style={{
                                            maxWidth: '100%',
                                            ...allFontName.fontCharm
                                        }}
                                    >
                                        {data?.find(x => x.id === khachMoiId)?.name}
                                    </Typography.Title>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <FloatButton
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => setOpenModal2(false)}
                    type='default'
                    style={{ right: 24, display: openModal2 ? '' : 'none', zIndex: 99999}}
                />

                <FloatButton
                    shape="circle"
                    style={{ right: 24, bottom: 100 }}
                    icon={isPlaying ? <AudioMutedOutlined /> : <AudioOutlined />}
                    onClick={() => setIsPlaying(!isPlaying)}
                />

                <FloatButton
                    shape="circle"
                    style={{ right: 24 }}
                    icon={<BookOutlined />}
                    type='primary'
                    onClick={() => setOpenModal2(true)}
                />
                
                <audio 
                    ref={ref}
                    src={musicLinks[musicPlaying]}
                    onEnded={() => handleEnded()}
                    onCanPlay={() => {
                        ref.current!.play()
                    }}
                />
            </div>
        </Spin>
    );
};

export default InviteCard;