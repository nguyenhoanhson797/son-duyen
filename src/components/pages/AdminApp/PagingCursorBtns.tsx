import { Button, Space } from 'antd'
import { CSSProperties } from 'react'
import { MetadataType } from '../../../constants/services'

interface IProps {
  onClickPrev: () => void
  onClickNext: () => void
  metaData: MetadataType | undefined
  justify?: 'flex-start' | 'flex-end' | 'center'
  displayNone?: boolean
  containerStyle?: CSSProperties
}

const PagingCursorBtns = ({
  onClickPrev,
  onClickNext,
  metaData,
  justify,
  displayNone,
  containerStyle,
}: IProps) => {
  const getJustifyContent = () => {
    if (!justify) {
      return 'center'
    }

    return justify
  }

  return (
    <Space
      size={8}
      style={{
        width: '100%',
        justifyContent: getJustifyContent(),
        overflow: 'auto',
        display: displayNone ? 'none' : undefined,
        ...containerStyle,
      }}
    >
      <Button
        disabled={!metaData?.prevPage}
        onClick={onClickPrev}
        size="small"
      >
        Trang trước
      </Button>

      <Button
        disabled={!metaData?.nextPage}
        onClick={onClickNext}
        size="small"
      >
        Trang sau
      </Button>
    </Space>
  )
}

PagingCursorBtns.defaultProps = {
  sizeBreakPoint: undefined,
  justify: undefined,
  containerStyle: undefined,
  displayNone: undefined,
}

export default PagingCursorBtns
