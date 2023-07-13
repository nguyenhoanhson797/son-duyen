import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Drawer, FloatButton, Modal, Space, Typography, message, theme } from 'antd';
import SettingDrawer from './SettingDrawer';
import { SettingOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import ReactCanvasConfetti from "react-canvas-confetti"
import { useWindowSize } from '../../hooks/window-size-hook';

const containerStyle: CSSProperties = { 
    width: '100vw', 
    height: '100vh', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#ecf3ff'
}

const spinArrayStyle: CSSProperties = {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    gap: 0,
    transition: 'all 5s ease-in-out',
    transform: 'translateY(0)'
}

const canvasStyles: CSSProperties  = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
}

const LotoApp = () => {
    const themeToken = theme.useToken().token
    const windowSize = useWindowSize()
    const isSmallSize = windowSize.width && windowSize.width <= 576

    const resultCardType: CSSProperties = { 
        overflow: 'hidden',
        height: isSmallSize ? 70 : 150,
        width: isSmallSize ? 70 : 150,
        padding: 0,
        margin: 0,
        backgroundColor: 'wheat',
        borderRadius: 12
    }

    const refAnimationInstance = useRef<any>(null);

    const getInstance = useCallback((instance: any) => {
        refAnimationInstance.current = instance;
    }, [])

    const makeShot = useCallback((particleRatio: any, opts: any) => {
        refAnimationInstance.current &&
        refAnimationInstance.current({
            ...opts,
            origin: { y: 0.7 },
            particleCount: Math.floor(200 * particleRatio)
        })
    }, [])

    const fire = useCallback(() => {
        makeShot(0.25, {
        spread: 26,
        startVelocity: 55
        });

        makeShot(0.2, {
        spread: 60
        });

        makeShot(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 45
        });
    }, [makeShot])

    const [valueRange, setValueRange] = useState<[number, number]>([0, 400])
    const [avoidValues, setAvoidValue] = useState<number[]>([1, 5, 0, 7])

    const [currentResult, setCurrentResult] = useState<number | undefined>(undefined)
    const [history, setHistory] = useState<number[]>([])

    const [openSetting, setOpenSetting] = useState(false)

    const [isSpining, setIsSpining] = useState<boolean | undefined>(undefined)
    const [isExpandDrawer, setIsExpandDrawer] = useState(false)

    const [spinArr1, setSpinArr1] = useState<number[]>([0])
    const [spinArr2, setSpinArr2] = useState<number[]>([0])
    const [spinArr3, setSpinArr3] = useState<number[]>([0])

    const getRandomNumber = () => {
        const resultArray = Array.from({ length: valueRange[1] - valueRange[0] + 1 }, (_, index) => valueRange[0] + index)
        if (resultArray.every(x => avoidValues.includes(x) || history.includes(x))) {
            message.warning('Đã hết số để quay!')
            return
        }
        setIsSpining(() => true)
        let result = Math.floor(Math.random() * (valueRange[1] - valueRange[0] + 1)) + valueRange[0]
        
        while (
            (result >= valueRange[0] && result <= valueRange[1]) &&
            (avoidValues.includes(result) || history.includes(result))
        ) {
            result = Math.floor(Math.random() * (valueRange[1] - valueRange[0] + 1)) + valueRange[0]
        }
        
        setCurrentResult(() => result)
        setTimeout(() => {
            setHistory((prev) => [result, ...prev])
            fire()
        }, 5000)
    }

    const handleReset = () => {
        Modal.confirm({
            content: 'Bạn có muốn reset lại tất cả giải thưởng không?',
            onOk: () => {
                setCurrentResult(() => undefined)
                setHistory(() => [])
            },
            rootClassName: 'defaultModal',
            className: 'defaultModal'
        })
    }

    const getSpinArray = (oldValue: number, newValue: number) => {
        const array = [oldValue, newValue]
        let i = oldValue + 1

        while (array.length <= 50) {
            array.splice(array.length - 1, 0, i)
            i++
            if (i > 9) {
                i = 0
            }
        }

        while (i !== newValue) {
            array.splice(array.length - 1, 0, i)
            i++
            if (i > 9) {
                i = 0
            }
        }

        return array
    }

    const handleFormatValue = (value: number) => {
        let one = 0
        let two = 0
        let three = 0

        if (`${value}`.length === 1) {
            three = value
        }

        if (`${value}`.length === 2) {
            two = Number(`${value}`[0])
            three = Number(`${value}`[1])
        }

        if (`${value}`.length === 3) {
            one = Number(`${value}`[0])
            two = Number(`${value}`[1])
            three = Number(`${value}`[2])
        }

        return {one, two, three}
    }

    useEffect(() => {
        if (isSpining) {
            const spin1 = getSpinArray(handleFormatValue(history[1] || 0).one ,handleFormatValue(currentResult || 0).one)
            setSpinArr1(() => spin1)

            const spin2 = getSpinArray(handleFormatValue(history[1] || 0).two ,handleFormatValue(currentResult || 0).two)
            setSpinArr2(() => spin2)

            const spin3 = getSpinArray(handleFormatValue(history[1] || 0).three ,handleFormatValue(currentResult || 0).three)
            setSpinArr3(() => spin3)

            setTimeout(() => {
                setIsSpining(false)
            }, 5000)
        }

        if (isSpining === false) {
            const spin1 = [handleFormatValue(history[0] || 0).one]
            setSpinArr1(() => spin1)

            const spin2 = [handleFormatValue(history[0] || 0).two]
            setSpinArr2(() => spin2)

            const spin3 = [handleFormatValue(history[0] || 0).three]
            setSpinArr3(() => spin3)

            setIsSpining(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpining])

    const getTranslateCal = (arr: number[]) => {
        if (isSpining) {
            return `translateY(${`-${100 * (arr.length - 1)}%`})`
        }
        if (isSpining === false) {
            return `translateY(${`0%`}), transition: 'unset',`
        }
        return `translateY(0%), , transition: 'unset',`
    }

    const getSpinContent = (arr: number[], value: number, delay?: string) => (
        isSpining ? (    
            <div style={resultCardType}>
                <div 
                    style={{ 
                        ...spinArrayStyle, 
                        transform: getTranslateCal(arr),
                        transitionDelay: delay
                    }} 
                >
                    {arr.map((item, index) => (
                        <div 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                minHeight: '100%'
                            }}
                            key={`1-${index}`}
                        >
                            <span style={{ fontSize: isSmallSize ? 30 : 46, fontWeight: 600 }}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div style={resultCardType}>
                <div 
                    style={{ 
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        gap: 0,
                    }} 
                >
                    <div 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: '100%', 
                            minHeight: '100%'
                        }}
                    >
                        <span style={{ fontSize: isSmallSize ? 30 : 46, fontWeight: 600 }}>
                            {value}
                        </span>
                    </div>
                </div>
            </div>
        )
    )

    return (
        <Space direction='vertical' style={containerStyle} size={24}>
            <Space size={isSmallSize ? 12 : 24} style={{ justifyContent: 'center' }} align='center' >
                {getSpinContent(spinArr1, handleFormatValue(history[0] || 0).one)}
                {getSpinContent(spinArr2, handleFormatValue(history[0] || 0).two)}
                {getSpinContent(spinArr3, handleFormatValue(history[0] || 0).three)}
            </Space>

            <Space size={12}>
                <Button
                    type="link" 
                    onClick={() => handleReset()}
                    disabled={isSpining}
                >
                    Reset
                </Button>

                <Button 
                    type="primary" 
                    style={{ backgroundColor: themeToken['green-6'] }} 
                    onClick={() => getRandomNumber()}
                    disabled={isSpining}
                >
                    QUAY SỐ
                </Button>
            </Space>

            <Drawer
                placement="bottom"
                // style={{ overflow: 'hidden', position: 'fixed' }}
                rootStyle={{ overflow: 'hidden', position: 'fixed' }}
                contentWrapperStyle={{ position: 'fixed' }}
                mask={isExpandDrawer}
                open
                height={isExpandDrawer ? '60vh' : '15vh'}
                closable={false}
                headerStyle={{ padding: 8 }}
                onClose={() => setIsExpandDrawer(false)}
                title={
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        Các số đã trúng thưởng:
                        <Button
                            type="link"
                            onClick={() => setIsExpandDrawer(!isExpandDrawer)}
                            icon={
                            isExpandDrawer ? (
                                <CaretDownOutlined />
                            ) : (
                                <CaretUpOutlined />
                            )
                            }
                        >
                            {isExpandDrawer ? 'Thu gọn' : 'Mở rộng'}
                        </Button>
                    </Space>
                }
            >
                <Space size={24} wrap style={{ maxHeight: '30vh', overflow: 'auto'}}>
                    {history.map(item => (
                        <Card 
                            key={item} 
                            style={{ 
                                border: 'none', 
                                backgroundColor: 'wheat', 
                                padding: 0, 
                                width: 120,
                                justifyContent: 'center' 
                            }}
                        >
                            <Typography.Title level={2} style={{ textAlign: 'center' }}>
                                {`${handleFormatValue(item).one}${handleFormatValue(item).two}${handleFormatValue(item).three}`}
                            </Typography.Title>
                        </Card>
                    ))}
                </Space>
            </Drawer>

            <SettingDrawer
                openSetting={openSetting}
                setOpenSetting={setOpenSetting}
                valueRange={valueRange}
                avoidValues={avoidValues}
                setValueRange={setValueRange}
                setAvoidValue={setAvoidValue}
            />

            <FloatButton
                shape="square"
                style={{ right: 24, bottom: '90vh' }}
                onClick={() => setOpenSetting(true)}
                type='primary'
                icon={<SettingOutlined />}
            />

            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </Space>
    );
};

export default LotoApp;