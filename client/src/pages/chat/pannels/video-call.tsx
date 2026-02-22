import { useState, useEffect } from 'react'
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VideoCallPanelProps {
  contactName: string
  contactAvatar: string
  userAvatar: string
  onEndCall: () => void
}

export function VideoCallPanel({
  contactName,
  contactAvatar,
  userAvatar,
  onEndCall,
}: VideoCallPanelProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRinging, setIsRinging] = useState(true)
  const [participantCount, setParticipantCount] = useState(1)

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
    <div className="relative h-screen w-full bg-black">
      {/* Remote Video - Main Display */}
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 to-black">
        <img
          src={contactAvatar}
          alt={contactName}
          className="h-full w-full object-cover"
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Call Info */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{contactName}</h2>
            <p className="text-sm text-gray-300">
              {isRinging ? 'Calling...' : formatDuration(callDuration)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20"
              >
                <MoreVertical className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mute Others</DropdownMenuItem>
              <DropdownMenuItem>Lock Meeting</DropdownMenuItem>
              <DropdownMenuItem>Meeting Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Local Video - PiP */}
        <div className="absolute bottom-24 right-6 h-40 w-40 overflow-hidden rounded-lg border-2 border-blue-500 shadow-lg">
          <img
            src={userAvatar}
            alt="You"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs font-semibold text-white">
            You
          </div>
        </div>

        {/* Participant Count */}
        <div className="absolute top-6 right-6 rounded-lg bg-black/50 px-4 py-2 text-white">
          <span className="text-sm">{participantCount} participant</span>
        </div>

        {/* Call Controls - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black to-transparent px-6 py-6">
          {/* Mute Button */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            className={`h-12 w-12 rounded-full p-0 ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          {/* Video Button */}
          <Button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`h-12 w-12 rounded-full p-0 ${
              isVideoOn
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          {/* Share Screen Button */}
          <Button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`h-12 w-12 rounded-full p-0 ${
              isScreenSharing
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <Share2 className="h-5 w-5" />
          </Button>

          {/* End Call Button */}
          <Button
            onClick={onEndCall}
            className="h-12 w-12 rounded-full bg-red-500 p-0 hover:bg-red-600"
            title="End call"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        {/* Screen Share Indicator */}
        {isScreenSharing && (
          <div className="absolute bottom-40 left-6 rounded-lg bg-green-500/90 px-4 py-2 text-white shadow-lg">
            <p className="text-sm font-semibold">You're sharing your screen</p>
          </div>
        )}

        {/* Call Stats */}
        <div className="absolute left-6 bottom-6 rounded-lg bg-black/50 p-4 text-xs text-gray-300">
          <div className="grid gap-2">
            <p>Resolution: 1920x1080</p>
            <p>Bitrate: 2.5 Mbps</p>
            <p>FPS: 30</p>
          </div>
        </div>
      </div>
    </div>
  )
}
