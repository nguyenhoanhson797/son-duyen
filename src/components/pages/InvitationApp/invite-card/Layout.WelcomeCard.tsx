import React , { CSSProperties, forwardRef } from 'react';
import { Modal, Space, Button, Skeleton, theme } from 'antd';
import { allFontName } from '../../../font/use-font';
import useWindowSize from '../../../hooks/window-size-hook';
import { GuestType } from '../../../../constants/services';

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
}

interface IProps {
    data: GuestType | undefined
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModal2: React.Dispatch<React.SetStateAction<boolean>>
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    backgroundLoaded: boolean
}

const LayoutWelcomeCard = forwardRef<HTMLAudioElement, IProps>((props, ref) => {
    const {
        data,
        openModal,
        setOpenModal,
        setOpenModal2,
        setIsPlaying,
        backgroundLoaded
    } = props
    const themeToken = theme.useToken().token
    const { isSmallSize } = useWindowSize({ smallSize: 960 , options: { needWindowSize: false } })

    const playAudio = () => {
        if (ref && 'current' in ref && ref.current) {
          ref.current.play();
        }
    }   

    return (
        <Modal
            open={openModal}
            footer={false}
            closable={false}
            style={{ 
                width: 600, 
                padding: 0, 
                borderRadius: 12,
                top: isSmallSize ? 40 : undefined,
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
                            playAudio()
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
    );
});

export default LayoutWelcomeCard;