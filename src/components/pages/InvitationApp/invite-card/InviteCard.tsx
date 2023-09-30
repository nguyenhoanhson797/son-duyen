/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GuestType, appService } from '../../../../constants/services';
import { Empty, FloatButton, Space, Spin, Tour, TourProps, theme } from 'antd';
import { axiosServiceCheck } from '../../../../constants/axios-service-check';
import { BookOutlined, AudioMutedOutlined, AudioOutlined, CloseOutlined } from '@ant-design/icons'
import '../../../font/font.css'
import '../../../animation/writing.css'
import '../../../animation/modal.css'
import '../../../animation/card.css'
import AnimationBox from '../AnimationBox';
import ScheduleModal from '../ScheduleModal';
import GiftPage from '../GiftPage';
import WishesPage from '../WishesPage';
import useWindowSize from '../../../hooks/window-size-hook';
import LayoutInviteCard from './Layout.InviteCard';
import LayoutWelcomeCard from './Layout.WelcomeCard';

const { useToken } = theme

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
    const { isSmallSize } = useWindowSize({ smallSize: 960 , options: { needWindowSize: false } })
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
                    size={isSmallSize ? 0 : 40} 
                    direction='vertical' 
                    style={{ 
                        width: isSmallSize ? '100vw' : '60vw', 
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

            <LayoutWelcomeCard
                data={data}
                openModal={openModal}
                setOpenModal={setOpenModal}
                setOpenModal2={setOpenModal2}
                setIsPlaying={setIsPlaying}
                backgroundLoaded={backgroundLoaded}
                ref={ref}
            />

            <LayoutInviteCard
                openModal2={openModal2}
                setOpenModal2={setOpenModal2}
                data={data}
                flipped={flipped}
                handleFlip={handleFlip}
            />

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