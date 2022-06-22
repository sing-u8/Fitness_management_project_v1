import { Injectable, Inject, OnDestroy } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Injectable({
    providedIn: 'root',
})
export class VideoProcessingService implements OnDestroy {
    constructor(@Inject(DOCUMENT) private document: Document) {}

    public canvasListener: () => void
    public videoErrListener: () => void
    public videoCanPlayListener: () => void

    ngOnDestroy(): void {}

    generateThumbnail(videoFile: Blob): Promise<{ url: string; file: File }> {
        const video: HTMLVideoElement = this.document.createElement('video')
        const canvas: HTMLCanvasElement = this.document.createElement('canvas')
        const context: CanvasRenderingContext2D = canvas.getContext('2d')

        return new Promise<{ url: string; file: File }>((resolve, reject) => {
            canvas.addEventListener('error', reject)
            video.addEventListener('error', reject)
            video.addEventListener('canplay', (event) => {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

                const thumbnailURL = canvas.toDataURL()
                const blobBin = atob(thumbnailURL.split(',')[1])
                const array = []
                for (let i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i))
                }
                const blob = new Blob([new Uint8Array(array)], { type: 'image/png' })
                const file = new File([blob], `chat-thumbnail.png`, { type: 'image/png' })

                resolve({ url: thumbnailURL, file: file })
                video.remove()
                canvas.remove()
            })
            if (videoFile.type) {
                video.setAttribute('type', videoFile.type)
            }
            video.preload = 'auto'
            video.src = window.URL.createObjectURL(videoFile)
            video.load()
        })
    }

    generateThumbnailFromVideoUrl(url: string): Promise<{ imgUrl: string }> {
        const video: HTMLVideoElement = this.document.createElement('video')
        const canvas: HTMLCanvasElement = this.document.createElement('canvas')
        const context: CanvasRenderingContext2D = canvas.getContext('2d')

        return new Promise<{ imgUrl: string }>((resolve, reject) => {
            canvas.addEventListener('error', reject)
            video.addEventListener('error', reject)
            video.addEventListener('loadeddata', (evt) => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
                video.pause()

                const dataURI = canvas.toDataURL('image/jpeg')
                const img = document.createElement('img')
                img.src = dataURI

                resolve({ imgUrl: dataURI })
                video.remove()
                canvas.remove()
            })
            video.preload = 'metadata'
            video.muted = true
            video.src = url
            video.playsInline = true
            video.setAttribute('crossOrigin', 'anonymous')
            video.play()
        })
    }
}
