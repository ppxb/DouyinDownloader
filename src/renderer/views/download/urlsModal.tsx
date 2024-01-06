import { useState, useMemo } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Tabs,
  Tab,
  Spinner,
  Card,
  CardBody,
  Tooltip,
  Avatar,
  Image,
  ScrollShadow
} from '@nextui-org/react'

import { extractDataFromUrls, urlPatterns } from '@renderer/utils/reg'
import { formatTime, formatSize } from '@renderer/utils/video'
import { ParsedVideoItem } from 'src/main/common/types'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const UrlsModal = ({ isOpen, onClose }: Props) => {
  const [urls, setUrls] = useState('')
  const [list, setList] = useState<ParsedVideoItem[]>([])
  const [selected, setSelected] = useState('input')

  const filterdUrls = useMemo(
    () => urls.split('\n').filter(i => i !== ''),
    [urls]
  )

  const handlePreviousClick = () => {
    if (selected === 'input') {
      onClose()
      setUrls('')
    } else {
      setSelected('input')
    }
  }

  const handleNextClick = async () => {
    if (selected === 'input' && urls.length > 0) {
      setSelected('preview')
      const ids = extractDataFromUrls(
        [...new Set(urls.split('\n'))],
        urlPatterns
      ).filter(i => i.name !== 'unknown')
      const res = await window.api.getPreview(ids)
      setList(res)
    } else {
      resetModal()
    }
  }

  const resetModal = () => {
    onClose()
    setList([])
    setUrls('')
    setSelected('input')
  }

  return (
    <Modal
      backdrop="blur"
      size="3xl"
      radius="lg"
      isDismissable={false}
      isOpen={isOpen}
      onClose={() => resetModal()}
    >
      <ModalContent>
        <ModalHeader>开始新的链接下载任务</ModalHeader>
        <ModalBody className="pt-0 gap-0">
          <Tabs
            selectedKey={selected}
            classNames={{
              tabList: 'hidden',
              panel: 'py-0'
            }}
          >
            <Tab key="input">
              <Textarea
                label="请输入单个或多个下载链接，换行以进行分隔"
                description={`共 ${filterdUrls.length} 个链接，其中共 ${
                  [...new Set(filterdUrls)].length
                } 个非重复项`}
                spellCheck="false"
                minRows={10}
                maxRows={15}
                value={urls}
                onValueChange={setUrls}
                classNames={{
                  input: 'break-all',
                  description: 'mt-2'
                }}
              />
            </Tab>
            <Tab key="preview">
              <div className="flex flex-col items-center justify-center min-h-80">
                <div className="text-tiny self-start text-foreground-400 mb-4">
                  共检测到 {list.length} 个视频
                </div>
                {list.length === 0 ? (
                  <Spinner />
                ) : (
                  <div className="flex flex-col w-full max-h-80 overflow-auto">
                    <div className="flex flex-col p-4">
                      {list.map(item => (
                        <Card key={item.id} className="mb-2">
                          <CardBody className="flex-row justify-between items-center px-4">
                            <div className="flex flex-col flex-[3]">
                              <p className="text-tiny text-default-500">
                                {item.id}
                              </p>
                              <Tooltip
                                content={item.title}
                                delay={0}
                                closeDelay={0}
                              >
                                <div className="w-52 text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-1">
                                  {item.title}
                                </div>
                              </Tooltip>
                              <div className="text-tiny">
                                @ {item.author.nickname}
                              </div>
                            </div>
                            <Image
                              width={80}
                              src={item.video.cover}
                              className="object-cover rounded-xl"
                            />
                            <div className="flex justify-center flex-1 text-tiny">
                              {item.video.width}P
                            </div>
                            <div className="flex justify-center flex-1 text-tiny">
                              {formatTime(item.video.duration)}
                            </div>
                            <div className="flex justify-end flex-1 text-tiny">
                              {formatSize(item.video.size)}M
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button
            radius="lg"
            color="danger"
            variant="light"
            onPress={handlePreviousClick}
          >
            {selected === 'input' ? '取消' : '上一步'}
          </Button>
          <Button radius="lg" color="primary" onPress={handleNextClick}>
            {selected === 'input' ? '下一步' : '开始'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UrlsModal
