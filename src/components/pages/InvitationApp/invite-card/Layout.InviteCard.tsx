import React, { CSSProperties } from 'react'
import { Modal, Typography } from 'antd'
import { allFontName } from '../../../font/use-font'
import useWindowSize from '../../../hooks/window-size-hook'
import { GuestType } from '../../../../constants/services'


const mirrorStyle: CSSProperties = {
    background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%,rgba(255,255,255,0) 100%), url('your-image-url') center center no-repeat",
    backgroundSize: 'cover',
    backdropFilter: 'blur(8px)',
    border: 'none'
}

interface IProps {
    openModal2: boolean
    setOpenModal2: React.Dispatch<React.SetStateAction<boolean>>
    data: GuestType | undefined
    flipped: boolean
    handleFlip: () => void
}

const LayoutInviteCard = ({
    openModal2,
    setOpenModal2,
    data,
    flipped,
    handleFlip
}: IProps) => {
    const { isSmallSize } = useWindowSize({ smallSize: 460 , options: { needWindowSize: false } })

    return (
        <Modal
            open={openModal2}
            footer={false}
            onCancel={() => setOpenModal2(false)}
            bodyStyle={{ padding: '0 !important'}}
            maskStyle={mirrorStyle}
            style={{top: isSmallSize ? '10vh' : '5vh', padding: '0 !important'}}
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
                                level={isSmallSize ? 2 : 1} 
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
    );
};

export default LayoutInviteCard;