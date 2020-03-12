const ffmpeg = require('../')

main()

async function main() {
    try {
        const video = await new ffmpeg('test.mov')
        console.log(video.metadata)

        console.log('Setting video codec')
        video.setStreamingMode(true)
        video.setVideoFormat('mp4')

        const rotated = [90, 180].includes(video.metadata.video.rotate)
        if (video.metadata.video.codec == 'h264' && video.metadata.audio.bitrate < 2800 &&
            video.metadata.video.fps <= 31 &&
            ((rotated && video.metadata.video.resolution.w <= 720) ||
                (!rotated && video.metadata.video.resolution.h <= 720))) {
            console.log('Video set to copy.')
            video.setVideoCodec('copy')
        } else {
            video.setVideoCodec('h264')
            video.setVideoBitRate(Math.min(2400, video.metadata.video.bitrate))
            video.setVideoFrameRate(video.metadata.video.fps + "/2")
            /*            if (video.metadata.video.rotate == 90)
                            video.setVideoTranspose(-90)
            
                        if (video.metadata.video.rotate == 270)
                            video.setVideoTranspose(90) */

            //            if (rotated)
            //                video.setVideoSize('720x?', false, false)
            //            else
            video.setVideoSize('?x720', false, false)
        }

        console.log('Setting audio codec')
        if (video.metadata.audio.codec == 'aac' && video.metadata.audio.bitrate < 160) {
            console.log('Audio set to copy.')
            video.setAudioCodec('copy')
        } else {
            video.setAudioCodec('aac')
            video.setAudioChannels(2)
            video.setAudioBitrate('128k')
            video.setAudioFrequency('44.1k')
        }

        const result = await video.save('test-output.mp4')
        console.log('Final result:')
        console.log(result)
    } catch (e) {
        console.log(e)
    }
}