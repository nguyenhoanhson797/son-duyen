import React, { useEffect, useState } from 'react';
import { SearchProps } from 'antd/es/input';
import { Input } from 'antd';
import useWindowSize from '../../hooks/window-size-hook';

const { Search } = Input

interface IProps {
    Props?: SearchProps
    collapse?: boolean
    sizeBreakpoint?: number
    align?: 'left' | 'right' | 'center'
}

const SearchButtons = ({ Props, collapse, sizeBreakpoint, align } : IProps) => {
    const { isSmallSize } = useWindowSize({ options: { needWindowSize: false } })

    const [isCollapse, setIsCollapse] = useState(collapse || false)

    useEffect(() => {
        if(collapse !== undefined){
            setIsCollapse(collapse)
        }
    }, [collapse])

    return (
        <div style={{textAlign: align || 'right'}} >
            <Search
                placeholder='Tìm kiếm'
                enterButton
                size={isSmallSize ? 'small' : 'middle'}
                style={{width: isCollapse ? 100 : undefined, transition: '0.3s ease'}}
                onFocus={() => setIsCollapse(false)}
                onBlur={() => setIsCollapse(collapse || false)}
                allowClear
                {...Props}
            />
        </div>
    );
};

export default SearchButtons;