import { useState, useEffect } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AudioCallPanelProps {
  contactName: string
  contactAvatar: string
  onEndCall: () => void
}

export function AudioCallPanel({
  contactName,
  contactAvatar,
  onEndCall,
}: AudioCallPanelProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVolumeMuted, setIsVolumeMuted] = useState(false)
  const [isRinging, setIsRinging] = useState(true)

  useEffect(() => {
    if (isRinging) {
      const timer = setTimeout(() => setIsRinging(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isRinging])

  useEffect(() => {
    if (isRinging) return

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRinging])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      {/* Avatar Circle */}
      <div className="mb-8">
        <img
          src={contactAvatar}
          alt={contactName}
          className={`h-32 w-32 rounded-full border-4 border-blue-500 object-cover shadow-2xl ${
            isRinging ? 'animate-pulse' : ''
          }`}
        />
      </div>

      {/* Contact Name */}
      <h1 className="text-4xl font-bold text-white">{contactName}</h1>

      {/* Status */}
      <p className="mt-4 text-xl text-gray-300">
        {isRinging ? 'Ringing...' : `Call duration: ${formatDuration(callDuration)}`}
      </p>

      {/* Call Controls */}
      <div className="mt-12 flex gap-6">
        {/* Mute Button */}
        <Button
          onClick={() => setIsMuted(!isMuted)}
          className={`h-14 w-14 rounded-full p-0 ${
            isMuted
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        {/* Volume Button */}
        <Button
          onClick={() => setIsVolumeMuted(!isVolumeMuted)}
          className={`h-14 w-14 rounded-full p-0 ${
            isVolumeMuted
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title={isVolumeMuted ? 'Unmute volume' : 'Mute volume'}
        >
          {isVolumeMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>

        {/* End Call Button */}
        <Button
          onClick={onEndCall}
          className="h-14 w-14 rounded-full bg-red-500 p-0 hover:bg-red-600"
          title="End call"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 gap-8">
        <div className="text-center">
          <p className="text-sm text-gray-400">Network Quality</p>
          <p className="mt-2 text-lg font-semibold text-green-400">Excellent</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">Codec</p>
          <p className="mt-2 text-lg font-semibold text-blue-400">Opus HD</p>
        </div>
      </div>
    </div>
  )
}
