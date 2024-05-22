import { useEffect, useState } from 'react'
import { NativeModules, Platform, StatusBar } from 'react-native'

type Props = {
  isPortraitMode: boolean
}

const NativeStatusBarManager = require('react-native/Libraries/Components/StatusBar/NativeStatusBarManagerIOS')

const PlatformAwareNativeModules = Platform.select({
  ios: NativeModules,
  android: NativeModules,
  macos: NativeModules,
  native: NativeModules,
  windows: NativeModules,
  web: { StatusBarManager: { getHeight: (cb: (height: number) => void) => cb(0) } },
})

export const useStatusBarHeightDetector = ({ isPortraitMode }: Props) => {
  const { StatusBarManager } = PlatformAwareNativeModules
  const [barHeight, setBarHeight] = useState(0)

  useEffect(() => {
    if (Platform.OS !== 'ios') return setBarHeight(StatusBar.currentHeight ?? 0)
    // handling edge case when app is opened in landscape mode and barHeight = 0
    const StatusBarManagerModule = NativeStatusBarManager?.default || StatusBarManager

    StatusBarManagerModule?.getHeight(({ height }: { height: number }) =>
      setBarHeight(isPortraitMode && height !== 0 ? height : 50)
    )
  }, [StatusBarManager, isPortraitMode])

  return {
    statusBarHeight: barHeight,
  }
}
