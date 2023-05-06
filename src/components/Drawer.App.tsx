import { Drawer } from 'antd';
import React from 'react';
import { OpenFormDrawerType } from './AppLayout';
import { title } from 'process';

interface IProps {
    openFormDrawer: OpenFormDrawerType | undefined
    setOpenFormDrawer: React.Dispatch<React.SetStateAction<OpenFormDrawerType | undefined>>
    handleCallService: () => void
}

const DrawerApp = ({
    openFormDrawer,
    setOpenFormDrawer,
    handleCallService

}: IProps) => {

    const getDrawerTitle = () => {
        switch(openFormDrawer?.action){
            case 'create':
                return 'Thêm khách mời'
            case 'edit':
                return 'Chỉnh sửa thông tin'
        }
    }
    
    return (
        <Drawer
            open={!!openFormDrawer}
            onClose={() => setOpenFormDrawer(undefined)}
            title={getDrawerTitle()}
        >

        </Drawer>
    );
};

export default DrawerApp;