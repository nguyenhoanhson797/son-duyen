import React from 'react';
import { GuestType, appService } from '../constants/services';
import { Button, Dropdown, MenuProps, Modal, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { axiosServiceCheck } from '../constants/axios-service-check';
import { OpenFormDrawerType } from './AppLayout';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { render } from '@testing-library/react';

interface IProps {
    data: GuestType[] | undefined
    setData: React.Dispatch<React.SetStateAction<GuestType[] | undefined>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    handleCallService: () => void
    setOpenFormDrawer: React.Dispatch<React.SetStateAction<OpenFormDrawerType | undefined>>
}

const TableApp = ({
    data,
    setData,
    setIsLoading,
    handleCallService,
    setOpenFormDrawer

}: IProps) => {

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Xóa khách mời',
            content: 'Bạn có muốn xóa khách mời này không?',
            okText: 'Xóa',
            cancelText: 'Quay lại',
            okButtonProps: {
                danger: true
            },
            onOk(){
                setIsLoading(true)
                appService().deleteKhachMoi(id)
                    .then(res => {
                        axiosServiceCheck({
                            res: res,
                            followUpAction: () => {
                                message.success('Đã xóa khách mời')
                                handleCallService()
                            }
                        })
                    })
                    .finally(() => setIsLoading(false))
            }
        })
    }

    const handleEdit = (data: GuestType) => {
        setOpenFormDrawer({
            action: 'edit',
            data: data
        })
    }

    const dropdownAction = (data: GuestType) => {
        const actionItems: MenuProps['items'] = [
            {
                key: '1',
                label: 'Chỉnh sửa',
                icon: <EditOutlined  />,
                onClick: () => {
                    handleEdit(data)
                }
            },
            {
                key: '2',
                label: 'Xóa khách mời',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(data.id),
                danger: true
            }
        ]

        return(
            <Dropdown
                placement="bottomRight"
                arrow
                trigger={['click']}
                menu={{ items: actionItems }}
            >
                <Button type='text' shape='circle' icon={<MoreOutlined />} />
            </Dropdown >
        )
    }

    const columns: ColumnsType<GuestType> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            align: 'center',
            render: (value: string, record: GuestType) => (
                <a onClick={() => handleEdit(record)}>
                    {value}
                </a>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            align: 'center'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            align: 'center'
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            width: 64,
            fixed: 'right',
            render: (_, record) => (
                dropdownAction(record)
            )
        }
    ]

    return (
        <Table 
            dataSource={data}
            rowKey={rec => rec.id}
            columns={columns}
            pagination={false}
            scroll={{x: 900}}
        />
    );
};

export default TableApp;