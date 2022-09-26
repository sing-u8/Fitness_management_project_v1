import { Injectable } from '@angular/core'

import dayjs from 'dayjs'
import _ from 'lodash'

import { FileService } from '@services/file.service'

import { ChatFile } from '@schemas/center/community/chat-file'
// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Injectable({
    providedIn: 'root',
})
export class CommonCommunityService {
    constructor(private fileService: FileService, private nxStore: Store) {}

    // createVideoThumbnail(fileList: ChatFileList, gymId: string) {
    //     const dataTrans = new DataTransfer()
    //     _.forEach(fileList, (fileObj) => {
    //         dataTrans.items.add(fileObj.videoImageFile)
    //     })
    //     return this.fileService.createFile({ tag: 'gym-chat', gym_id: gymId }, dataTrans.files)
    // }

    // create file in aws
    createChatFilesWithReport(fileList: Array<ChatFile>, center_id: string, center_chat_room_id: string) {
        const dataTrans = new DataTransfer()
        _.forEach(fileList, (fileObj) => {
            dataTrans.items.add(fileObj.file)
        })
        return this.fileService.createFileWithReport(
            { type_code: 'file_type_center_chat', center_id, center_chat_room_id },
            dataTrans.files
        )
    }

    // functions related to files
    setChatFileType(
        fileList: Array<{
            location: string
            contentType: string
            originalname: string
            size: number
        }>
    ): 'text' | 'image' | 'file' | 'video' {
        const firstFileType = fileList[0].contentType.split('/')[0]
        const isAllSameType = fileList.every((file) => {
            return file.contentType.split('/')[0] == firstFileType
        })
        if (!isAllSameType) {
            return 'file'
        } else {
            return firstFileType.includes('application')
                ? 'file'
                : firstFileType.includes('image')
                ? 'image'
                : firstFileType.includes('video')
                ? 'video'
                : 'text'
        }
    }

    checkFileLengthExceed(fileLength: number, limit: number): boolean {
        if (fileLength >= limit) {
            this.nxStore.dispatch(showToast({ text: `최대 ${limit}개까지만 동시에 전송할 수 있어요.` }))
            return true
        }
        return false
    }
    checkFileSizeTooLarge(file: File, limitSize = 300): boolean {
        const fileIsTooLarge = _.round(file.size / (1024 * 1024), 4) >= limitSize
        return fileIsTooLarge
    }

    setLocalFileType(file: File): string {
        return file.type.includes('image')
            ? 'image'
            : file.type.includes('video')
            ? 'video'
            : file.type.includes('application')
            ? 'file'
            : 'text'
    }

    // functoins related to message
    // related to  show user avatar
    showUser(msgList: Array<any>, index) {
        return !(
            msgList.length > index + 1 &&
            msgList[index].user &&
            msgList[index].user?._id == msgList[index + 1].user?._id &&
            dayjs(msgList[index].timestamp).format('YYYY-MM-DD_HH_mm') ==
                dayjs(msgList[index + 1].timestamp).format('YYYY-MM-DD_HH_mm') &&
            msgList[index + 1].type != 'info'
        )
    }
}
