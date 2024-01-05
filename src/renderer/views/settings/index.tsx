import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Divider,
  Select,
  SelectItem,
  Selection,
  Input,
  Switch,
  Tooltip
} from '@nextui-org/react'

import useAppStore from '@renderer/store'
import { ReloadIcon, KeyIcon, FolderIcon } from '@renderer/components/icon'

const SettingsView = () => {
  const theme = ['暗黑', '明亮', '跟随系统']
  const language = ['简体中文', '繁體中文', 'English']
  const [themeValue, setThemeValue] = useState<Selection>(new Set(['明亮']))
  const [languageValue, setLanguageValue] = useState<Selection>(
    new Set(['简体中文'])
  )
  const { cookie, updateCookie, dir } = useAppStore.use
  const updateDir = useAppStore.use.updateDir()

  const handleSelectDownloadDir = () => {
    const path = window.api.selectDownloadDir()
    updateDir(path)
  }

  return (
    <Card radius="none" className="relative overflow-visible">
      <CardHeader className="flex pt-10 px-8 sticky z-40 top-0 mb-2 backdrop-blur-lg">
        <div className="felx flex-col">
          <div className="text-2xl font-bold mb-1">设置</div>
          <div className="text-tiny text-foreground/50">在此处进行全局设置</div>
        </div>
      </CardHeader>
      <CardBody className="px-5 py-4">
        <Card>
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">当前版本：Beta 0.0.1</div>
              <div className="text-tiny text-foreground/50">已是最新版本</div>
            </div>
            <Button
              size="sm"
              radius="lg"
              variant="light"
              startContent={<ReloadIcon className="icon-default" />}
              className="ml-auto text-sm"
            >
              检查更新
            </Button>
          </CardBody>
          <Divider />
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">主题</div>
              <div className="text-tiny text-foreground/50">
                当前使用的主题配色
              </div>
            </div>
            <Select
              size="sm"
              radius="lg"
              selectedKeys={themeValue}
              onSelectionChange={setThemeValue}
              aria-label="Select app theme"
              className="ml-auto max-w-32"
              classNames={{
                trigger: 'min-h-unit-0 h-8'
              }}
            >
              {theme.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
          <Divider />
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">语言</div>
              <div className="text-tiny text-foreground/50">当前使用的语言</div>
            </div>
            <Select
              size="sm"
              radius="lg"
              selectedKeys={languageValue}
              onSelectionChange={setLanguageValue}
              aria-label="Select app language"
              className="ml-auto max-w-32"
              classNames={{
                trigger: 'min-h-unit-0 h-8'
              }}
            >
              {language.map(l => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </CardBody>
      <CardBody className="px-5 py-4">
        <Card>
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">当前版本：Beta 0.0.1</div>
              <div className="text-tiny text-foreground/50">已是最新版本</div>
            </div>
            <Button
              size="sm"
              radius="lg"
              variant="light"
              startContent={
                <ReloadIcon className="text-foreground/50 dark:text-white/90 pointer-events-none flex-shrink-0" />
              }
              className="ml-auto text-sm"
            >
              检查更新
            </Button>
          </CardBody>
          <Divider />
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">主题</div>
              <div className="text-tiny text-foreground/50">
                当前使用的主题配色
              </div>
            </div>
            <Select
              size="sm"
              radius="lg"
              selectedKeys={themeValue}
              onSelectionChange={setThemeValue}
              aria-label="Select app theme"
              className="ml-auto max-w-32"
              classNames={{
                trigger: 'min-h-unit-0 h-8'
              }}
            >
              {theme.map(t => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
          <Divider />
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">语言</div>
              <div className="text-tiny text-foreground/50">当前使用的语言</div>
            </div>
            <Select
              size="sm"
              radius="lg"
              selectedKeys={languageValue}
              onSelectionChange={setLanguageValue}
              aria-label="Select app language"
              className="ml-auto max-w-32"
              classNames={{
                trigger: 'min-h-unit-0 h-8'
              }}
            >
              {language.map(l => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>
      </CardBody>
      <CardBody className="px-5 py-4">
        <Card>
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">Cookie</div>
              <div className="text-tiny text-foreground/50">
                请使用有效的抖音 Cookie
              </div>
            </div>
            <Input
              isClearable
              size="sm"
              radius="lg"
              spellCheck="false"
              placeholder="请填写 Cookie"
              className="ml-auto max-w-80"
              classNames={{
                input: [
                  'bg-transparent',
                  'text-black/90 dark:text-white/90',
                  'placeholder:text-default-700/50 dark:placeholder:text-white/60'
                ],
                innerWrapper: 'bg-transparent pb-0',
                inputWrapper: [
                  'h-8 min-h-unit-8',
                  'bg-default-200/50',
                  'dark:bg-default/60',
                  'backdrop-blur-xl',
                  'backdrop-saturate-200',
                  'hover:bg-default-200/70',
                  'dark:hover:bg-default/70',
                  'group-data-[focused=true]:bg-default-200/50',
                  'dark:group-data-[focused=true]:bg-default/60',
                  '!cursor-text'
                ]
              }}
              startContent={<KeyIcon className="icon-default" />}
              value={cookie()}
              onValueChange={updateCookie()}
            />
          </CardBody>
          <Divider />
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">默认存储位置</div>
              <div className="text-tiny text-foreground/50">
                下载文件时的默认存储位置
              </div>
            </div>
            <div className="flex ml-auto gap-2">
              <Tooltip content={dir()} delay={0} closeDelay={0}>
                <Input
                  disabled
                  size="sm"
                  radius="lg"
                  spellCheck="false"
                  className="w-60"
                  classNames={{
                    input: [
                      'bg-transparent',
                      'text-black/90 dark:text-white/90',
                      'placeholder:text-default-700/50 dark:placeholder:text-white/60'
                    ],
                    innerWrapper: 'bg-transparent pb-0',
                    inputWrapper: [
                      'h-8 min-h-unit-8',
                      'bg-default-200/50',
                      'dark:bg-default/60',
                      'backdrop-blur-xl',
                      'backdrop-saturate-200',
                      'hover:bg-default-200/70',
                      'dark:hover:bg-default/70',
                      'group-data-[focused=true]:bg-default-200/50',
                      'dark:group-data-[focused=true]:bg-default/60',
                      '!cursor-text'
                    ]
                  }}
                  value={dir()}
                />
              </Tooltip>

              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleSelectDownloadDir}
              >
                <FolderIcon className="icon-default" />
              </Button>
            </div>
          </CardBody>
        </Card>
      </CardBody>
      <CardBody className="px-5 py-4">
        <Card>
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">使用代理</div>
              <div className="text-tiny text-foreground/50">
                是否使用系统代理如 v2rayN 或 Clash 等
              </div>
            </div>
            <Switch size="sm" color="success" className="ml-auto" />
          </CardBody>
        </Card>
      </CardBody>
      <CardBody className="px-5 py-4">
        <Card>
          <CardBody className="flex flex-row items-center px-5">
            <div className="flex flex-col">
              <div className="text-sm font-bold mb-1">重置所有设置</div>
              <div className="text-tiny text-foreground/50">
                重置所有设置为默认值
              </div>
            </div>
            <Button
              size="sm"
              radius="lg"
              color="danger"
              variant="flat"
              className="ml-auto"
            >
              立即重置
            </Button>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  )
}

export default SettingsView
