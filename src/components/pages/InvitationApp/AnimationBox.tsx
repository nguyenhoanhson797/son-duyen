import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../hooks/window-size-hook';
import { useSpring, animated } from '@react-spring/web'

const animationType = {
    fade: {
        in: {
            from: { opacity: 0},
            to: { opacity: 1},
        },
        out: {
            from: { opacity: 1},
            to: { opacity: 0},
        }
    },
    right: {
        in: {
            from: { opacity: 0, x: 400 },
            to: { opacity: 1, x: 0 },
        },
        out: {
            from: { opacity: 1, x: 0 },
            to: { opacity: 0, x: 400 },
        }
    },
    left: {
        in: {
            from: { opacity: 0, x: -400 },
            to: { opacity: 1, x: 0 },
        },
        out: {
            from: { opacity: 1, x: 0 },
            to: { opacity: 0, x: -400 },
        }
    }
}


interface IProps {
    boxKey: number
    imgUrl: string
    onlyCover?: boolean
    disableAnimation?: boolean
    animationSet?: 'fade' | 'right' | 'left'
}

const AnimationBox = ({ boxKey, imgUrl, onlyCover, disableAnimation, animationSet }: IProps) => {
    const windowSize = useWindowSize()
    const isMobileSize = windowSize.width && windowSize.width <= 960

    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => {
            const top = ref.current!.getBoundingClientRect().top;
            const bottom = ref.current!.getBoundingClientRect().bottom;

            if (top < window.innerHeight && bottom > 0) {
                setInView(true);
            } else {
                setInView(false);
            }
        };

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const [springs, api] = useSpring(() => (
        {from:{ opacity: 1, x: 0, config: { duration: 300 } }}
    ))

    useEffect(() => {
        if (inView) {
            api.start(animationSet ? animationType[animationSet].in : animationType.fade.in)
        } else {
            api.start(animationSet ? animationType[animationSet].out : animationType.fade.out)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    const getBackground = (): CSSProperties => {
        return {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'auto',
            height: '100vh',
            backgroundImage: `url('https://cdn.jsdelivr.net/gh/nguyenhoanhson797/image@main/${imgUrl}')`,
            backgroundSize: onlyCover ? 'cover' : (isMobileSize ? 'contain' : 'cover'),
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            position: 'relative'
        }
    }

    const animation = disableAnimation ? undefined : springs

    return <animated.div key={boxKey} style={{ ...getBackground(), ...animation }} ref={ref} />;
};

export default AnimationBox;