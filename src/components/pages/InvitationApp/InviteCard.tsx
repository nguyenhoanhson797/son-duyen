/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GuestType, appService } from '../../../constants/services';
import { Affix, Button, Card, Empty, FloatButton, Modal, Skeleton, Space, Spin, Tour, TourProps, Typography, theme } from 'antd';
import { axiosServiceCheck } from '../../../constants/axios-service-check';
import { BookOutlined, AudioMutedOutlined, AudioOutlined, CloseOutlined } from '@ant-design/icons'
import { useWindowSize } from '../../../constants/window-size-hook';
import { allFontName } from '../../font/use-font';
import '../../font/font.css'
import '../../animation/writing.css'
import '../../animation/modal.css'
import '../../animation/card.css'
import AnimationBox from './AnimationBox';
import ScheduleModal from './ScheduleModal';
import GiftPage from './GiftPage';
import WishesPage from './WishesPage';

const { Title } = Typography
const { useToken } = theme

const mirrorMaskStyle: CSSProperties = {
    background: "linear-gradient(to bottom, rgba(140,140,140,0.5) 0%,rgba(140,140,140,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(5px)',
    border: 'none'
}

const mirrorStyle: CSSProperties = {
    background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(8px)',
    border: 'none'
}

const contentStyle: CSSProperties = {
    margin: 0,
    textAlign: 'center',
    border: 'none',
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
    const themeToken = useToken().token

    const closeBtnRef = useRef<HTMLButtonElement | null>(null)

    const [data, setData] = useState<GuestType | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModal2, setOpenModal2] = useState(false)
    const [musicPlaying, setMusicPlaying] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [flipped, setFlipped] = useState(false)

    const [backgroundLoaded, setBackgroundLoaded] = useState(false)
    const [openTool, setOpenTool] = useState(false)

    const toolSteps: TourProps['steps'] = [
        {
          title: openModal2 ? 'Nhấn để đóng thiệp và xem tiếp nội dung bên dưới' : 'Nhấn để xem lại thiệp mời của bạn',
          prevButtonProps: {
            style: { display: 'none' }
          },
          nextButtonProps: {
            children: 'Tôi đã hiểu',
            onClick: () => setOpenTool(false),
            style: { backgroundColor: themeToken['cyan-6'] },
          },
          target: () => closeBtnRef.current!,
          style: { maxWidth: '90vw'},
        },
    ]

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
        appService().getKhachMoi(khachMoiId)
            .then(res => {
                axiosServiceCheck({
                    res: res,
                    followUpAction: () => {
                        setData(res.data)
                        setOpenModal(true)
                    }
                })
            })
            .finally(() => setIsLoading(false))
    }

    const handleEnded = () => {
        let next = musicPlaying + 1
        if(next >= 6){
            next = 0
        }
        setMusicPlaying(next)
        ref.current!.load()
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
        let timeout: any
        if(!openModal2){
            setFlipped(false)
            clearTimeout(timeout)
        } else {
            timeout = setTimeout(() => {
                setOpenTool(true)
            }, 5000)
        }

        return(() => {
            clearTimeout(timeout)
        })
    }, [openModal2])

    useEffect(() => {
        const img = new Image();
        img.src = 'https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/background-app.jpg';
        img.onload = () => {
            setBackgroundLoaded(true);
        }
    }, [])

    return (
        <Spin spinning={isLoading} delay={300} size='large'>
            <Space style={{ width: '100%', justifyContent: 'center' }} >
                <Space 
                    size={isMobileSize ? 0 : 40} 
                    direction='vertical' 
                    style={{ 
                        width: isMobileSize ? '100vw' : '60vw', 
                        height: 'max-content', 
                        padding: '0 10px', 
                        boxSizing: 'border-box', 
                        overflow: 'hidden',
                        justifyContent: 'center'
                    }}
                >
                    <AnimationBox imgUrl='background-app-1.jpg' boxKey={1} disableAnimation />
                    <AnimationBox imgUrl='background-app-2.jpg' boxKey={2} isVertical disableAnimation />
                    <ScheduleModal />
                    <AnimationBox imgUrl='background-app-3.jpg' boxKey={3} isVertical animationSet='right'  />
                    <AnimationBox imgUrl='background-app-4.jpg' boxKey={4} isVertical animationSet='left' />
                    <AnimationBox imgUrl='background-app-5.jpg' boxKey={6} isVertical animationSet='fade' />
                    <AnimationBox imgUrl='background-app-6.jpg' boxKey={6} isVertical animationSet='right'  />
                    <AnimationBox imgUrl='background-app-7.jpg' boxKey={7} isVertical animationSet='fade' />
                    <AnimationBox imgUrl='background-app-8.jpg' boxKey={8} isVertical animationSet='left' />
                    <AnimationBox imgUrl='background-app-9.jpg' boxKey={9} isVertical animationSet='right'  />
                    <AnimationBox imgUrl='background-app-10.jpg' boxKey={10} isVertical animationSet='fade' />
                    <AnimationBox imgUrl='background-app-11.jpg' boxKey={11} isVertical animationSet='fade' />
                    <AnimationBox imgUrl='background-app-12.jpg' boxKey={12} isVertical animationSet='left' />
                    <AnimationBox imgUrl='background-app-13.jpg' boxKey={13} isVertical animationSet='right'  />
                    <AnimationBox imgUrl='background-app-14.jpg' boxKey={14} isVertical animationSet='left' />
                    <GiftPage />
                    <WishesPage userData={data} />
                </Space>
            </Space>

            {/* Welcome Card */}
            <Modal
                open={openModal}
                footer={false}
                closable={false}
                style={{ 
                    width: 600, 
                    padding: 0, 
                    borderRadius: 12,
                    top: isMobileSize ? 40 : undefined,
                    overflow: 'hidden', 
                    position: 'relative' 
                }}
                maskStyle={mirrorMaskStyle}
                className={'custom-modal'}
                bodyStyle={{
                    margin: 0, 
                    padding: 0,
                    backgroundImage: 'url("https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/background-app.jpg")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '70vh',
                    width: 'auto',
                    borderRadius: 12,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {backgroundLoaded ? (
                    <Space
                        style={{ 
                            ...contentStyle, 
                            ...mirrorStyle, 
                            width: '90%', 
                            justifyContent: 'space-between', 
                            position: 'absolute', 
                            bottom: 10,
                            borderRadius: 6
                        }} 
                        direction='vertical' 
                        align='center'
                    >
                        <div className='typewriter1st'>
                            <h3>Xin Chào</h3>
                        </div>
                        <div className='typewriter2nd' style={{...allFontName.fontCharm}} >
                            <h1>{data?.name}</h1>
                        </div>
                        <Button
                            onClick={() => {
                                setOpenModal(false)
                                setOpenModal2(true)
                                setIsPlaying(true)
                                ref.current!.play()
                            }}  
                            type='primary'
                            style={{ marginBottom: 20, backgroundColor: themeToken['lime-6'] }}
                        >
                            Tiếp tục
                        </Button>
                    </Space>
                ) : (
                    <Skeleton active />
                )}
            </Modal>
            
            {/* Invite Card */}
            <Modal
                open={openModal2}
                footer={false}
                onCancel={() => setOpenModal2(false)}
                bodyStyle={{ padding: '0 !important'}}
                maskStyle={mirrorStyle}
                style={{top: windowSize.width && windowSize.width <= 460 ? '10vh' : '5vh', padding: '0 !important'}}
                closable={false}
                className={'custom-modal'}
            >
                <div
                    className={`card-container ${flipped ? 'flipped' : ''}`}
                    onClick={handleFlip}
                >
                    <div className="card-front">
                        <div
                            style={{
                                backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/card-front.jpg')",
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                aspectRatio: '1/1.42',
                                maxHeight: '90vh',
                                width: 'auto',
                                position: 'relative'
                            }}
                        >
                            <div className="card-hint" style={{ fontSize: 24 }}>
                                Bấm để lật thiệp
                            </div>
                        </div>
                    </div>

                    <div className="card-back">
                        <div
                            style={{
                                backgroundImage: "url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/card-back.jpg')",
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
                                    flexWrap: 'wrap',
                                    overflow: 'auto'
                            }}
                            >
                                <Typography.Title 
                                    level={isMobileSize ? 2 : 1} 
                                    style={{
                                        maxWidth: '100%',
                                        ...allFontName.fontCharm
                                    }}
                                >
                                    {data?.name}
                                </Typography.Title>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <FloatButton
                ref={closeBtnRef}
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

            <Tour open={openTool} onClose={() => setOpenTool(false)} steps={toolSteps} />
            
            <audio 
                ref={ref}
                src={musicLinks[musicPlaying]}
                onEnded={() => handleEnded()}
                onCanPlay={() => {
                    ref.current!.play()
                }}
            />
        </Spin>
    );
};

export default InviteCard;