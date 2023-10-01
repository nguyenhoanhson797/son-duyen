import React, { ReactNode } from 'react';
import { GuestType, appService } from '../../../constants/services';
import { Button, Dropdown, MenuProps, Modal, Table, message, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { axiosServiceCheck } from '../../../constants/axios-service-check';
import { OpenFormDrawerType } from './AdminAppLayout';
import { APP_URL } from '../../../constants/app-config';
import { EditOutlined, DeleteOutlined, MoreOutlined, BranchesOutlined, CopyOutlined } from '@ant-design/icons'
import useWindowSize from '../../hooks/window-size-hook';

const { Link } = Typography

interface IProps {
    data: GuestType[] | undefined
    setData: React.Dispatch<React.SetStateAction<GuestType[] | undefined>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    handleCallService: () => void
    setOpenFormDrawer: React.Dispatch<React.SetStateAction<OpenFormDrawerType | undefined>>
    pagingBtns: ReactNode
}

const TableAdminApp = ({
    data,
    setData,
    setIsLoading,
    handleCallService,
    setOpenFormDrawer,
    pagingBtns
}: IProps) => {

    const { isSmallSize } = useWindowSize({ smallSize: 800, options: { needWindowSize: false } })

    const handleDelete = (item: GuestType) => {
        Modal.confirm({
            title: `Xóa khách mời: ${item.name}`,
            content: 'Bạn có muốn xóa khách mời này không?',
            okText: 'Xóa',
            cancelText: 'Quay lại',
            okButtonProps: {
                danger: true
            },
            style: { padding: '20px !important' },
            rootClassName: 'defaultModal',
            className: 'defaultModal',
            onOk(){
                setIsLoading(true)
                appService().deleteKhachMoi(item.id)
                    .then(res => {
                        axiosServiceCheck({
                            res: res,
                            followUpAction: () => {
                                message.success('Đã xóa khách mời')
                                if (!data || data.length < 5) {
                                    handleCallService()
                                    return
                                }
                                setData((prev) => {
                                    const clone = prev?.filter(
                                        (x) => x.id !== item.id || x.Id !== item.id
                                    )
                                    return clone
                                })
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
                label: 'Copy link thiệp',
                icon: <CopyOutlined />,
                onClick: () => {
                    navigator.clipboard.writeText(APP_URL+'thiep-moi/'+data.id)
                        .then(() => {
                            message.success(`Đã copy link thiệp của [ ${data.name} ] vào khay nhớ tạm`);
                        })
                        .catch(() => {
                            message.error('Hành động thất bại, vui lòng mở bằng trình duyệt.')
                        })
                }
            },
            {
                key: '3',
                label: <Link href={APP_URL+'thiep-moi/'+data.id} target='_blank' >Đi tới thiệp</Link >,
                icon: <BranchesOutlined style={{color: '#1677ff'}}/>,
            },
            {
                key: '4',
                label: 'Xóa khách mời',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(data),
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
            align: 'left',
            width: 240,
            render: (value: string, record: GuestType) => (
                <Typography.Link onClick={() => handleEdit(record)}>
                    {value}
                </Typography.Link>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            align: 'center',
            width: 160,
            render: value => (
                value ? (
                    <span> {`+84 ${value}`} </span>
                ) : ('')
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            align: 'center',
            width: 160,
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            align: 'center',
            width: 200,
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
            rowKey={rec => rec.Id || rec.id}
            columns={columns}
            pagination={false}
            scroll={{ x: 824 }}
            size={isSmallSize ? 'small' : undefined}
            footer={() => pagingBtns}
        />
    );
};

export default TableAdminApp;