import { CSSProperties, useState } from 'react'
import { Button, Carousel, FloatButton, Modal, Space, Statistic, Typography, theme } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useWindowSize } from '../../hooks/window-size-hook'
import { allFontName } from '../../font/use-font';
import { CloseOutlined } from '@ant-design/icons'
import './scheduleModal.css'

dayjs.extend(utc)

const { Text } = Typography
const { useToken } = theme

const backgroundStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    width: '100%',
    maxWidth: '96vw',
    height: 'auto',
    backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/flower-gate.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative'
}

const contentStyle: CSSProperties = {
    height: 250,
    maxWidth: 480, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f3e0',
    borderRadius: 8,
}

const ScheduleModal = () => {
    const themeToken = useToken().token
    const windowSize = useWindowSize()
    const isSmallSize = windowSize.width && windowSize.width <= 576

    const [openSchedule, setOpenSchedule] = useState(false)

    const getCountdown = () => {
        const current = dayjs()
        const end = dayjs('2023-07-14T10:30:00.000Z')
    
        const valueStyle: CSSProperties = {
          textAlign: 'center',
          fontSize: isSmallSize ? 36 : 76,
          ...allFontName.fontAmatic
        }
    
        switch (true) {
          case current.isAfter(end):
            return (
              <Statistic
                value="Đã diễn ra"
                valueStyle={{
                  textAlign: 'center',
                }}
              />
            )
          case current.isBefore(end, 'year') && end.diff(current, 'year') > 0:
            return (
              <Statistic.Countdown
                valueStyle={valueStyle}
                value={Date.now() + end.diff(current)}
                format="Y [năm] M [tháng]"
              />
            )
          case current.isBefore(end, 'month') && end.diff(current, 'month') > 0:
            return (
              <Statistic.Countdown
                valueStyle={valueStyle}
                value={Date.now() + end.diff(current)}
                format="M [tháng] D [ngày]"
              />
            )
          case current.isBefore(end, 'day') && end.diff(current, 'day') > 0:
            return (
              <Statistic.Countdown
                valueStyle={valueStyle}
                value={Date.now() + end.diff(current)}
                format="D [ngày] H [tiếng]"
              />
            )
          case current.isBefore(end, 'hour') && end.diff(current, 'hour') > 0:
            return (
              <Statistic.Countdown
                valueStyle={valueStyle}
                value={Date.now() + end.diff(current)}
                format="H [tiếng] m [phút]"
              />
            )
          case current.isBefore(end, 'minute'):
            return (
              <Statistic.Countdown
                valueStyle={valueStyle}
                value={Date.now() + end.diff(current)}
                format="m [phút] s [giây]"
              />
            )
          default:
            return (
              <Statistic
                valueStyle={valueStyle}
                value={undefined}
              />
            )
        }
    }

    const getBackgroundStyle = (url: string): CSSProperties => {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
        width: isSmallSize ? 100 : 180,
        height: '100%',
        backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/svg@main/${url}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative'
      }
    }

    return (
        <>
            <Modal
                open={openSchedule}
                footer={false}
                onCancel={() => setOpenSchedule(false)}
                destroyOnClose
            >
                <Carousel dots={{ className: 'carouselDots' }} style={{ overflow: 'hidden' }} autoplay>
                    <div>
                        <div style={contentStyle}>
                            <Space style={{ justifyContent: 'space-evenly', width: '100%' }}>
                              <div style={getBackgroundStyle('gate.png')} />
                              <Space size={4} direction='vertical'>
                                <Text style={{ fontSize: 24, ...allFontName.fontCharm}}>Đón khách</Text>
                                <Text style={{ fontSize: 40, ...allFontName.fontAmatic}}>15h30</Text>
                              </Space>
                            </Space>
                        </div>
                    </div>
                    <div>
                        <div style={contentStyle}>
                            <Space style={{ justifyContent: 'space-evenly', width: '100%' }}>
                              <Space size={4} direction='vertical'>
                                <Text style={{ fontSize: 24, ...allFontName.fontCharm}}>Khai lễ</Text>
                                <Text style={{ fontSize: 40, ...allFontName.fontAmatic}}>16h00</Text>
                              </Space>
                              <div style={getBackgroundStyle('ring.png')} />
                            </Space>
                        </div>
                    </div>
                    <div>
                        <div style={contentStyle}>
                            <Space style={{ justifyContent: 'space-evenly', width: '100%' }}>
                              <Space size={4} direction='vertical'>
                                <Text style={{ fontSize: 24, ...allFontName.fontCharm}}>Khai tiệc</Text>
                                <Text style={{ fontSize: 40, ...allFontName.fontAmatic}}>16h30</Text>
                              </Space>
                              <div style={getBackgroundStyle('dishes.png')} />
                            </Space>
                        </div>
                    </div>
                    <div>
                        <div style={contentStyle}>
                            <Space style={{ justifyContent: 'space-evenly', width: '100%' }}>
                              <div style={getBackgroundStyle('game.png')} />
                              <Space size={4} direction='vertical'>
                                <Text style={{ fontSize: 24, ...allFontName.fontCharm}}>Trò chơi</Text>
                                <Text style={{ fontSize: 40, ...allFontName.fontAmatic}}>19h45</Text>
                              </Space>
                            </Space>
                        </div>
                    </div>
                </Carousel>
            </Modal>

            <div style={backgroundStyle}>
                <Space 
                    direction='vertical'
                    size={isSmallSize ? 24 : 60}
                    align='center'
                    style={{ width: '65%', height: '55%', justifyContent: 'center' }}
                >
                    <Space size={0} direction='vertical' style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: isSmallSize ? 16 : 32, ...allFontName.fontCharm, textAlign: 'center' }}>
                          Còn lại ...
                        </Text>
                        {getCountdown()}
                    </Space>
                    <Button 
                        type='primary' 
                        style={{ backgroundColor: themeToken['cyan-6'] }} 
                        onClick={(() => setOpenSchedule(true))}
                    >
                        <Text style={{ fontSize: 16, color: 'white', ...allFontName.fontCharm }}>
                          Xem lịch trình
                        </Text>
                    </Button>
                </Space>
            </div>

            <FloatButton
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => setOpenSchedule(false)}
                type='default'
                style={{ right: 24, display: openSchedule ? '' : 'none', zIndex: 99999}}
            />
        </>
    );
};

export default ScheduleModal;