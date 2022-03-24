import { Injectable } from '@angular/core'

export interface LocalFileData {
    src: string
    file: any
}

@Injectable({
    providedIn: 'root',
})
export class PictureManagementService {
    public localPicData: LocalFileData
    constructor() {
        this.resetLocalPicData()
    }

    onInputFileChange(photoBlob, afterOnLoadFn?: (localFileData: LocalFileData) => void) {
        if (!this.isFileExist(photoBlob.files)) return

        const localPhotoFile = photoBlob.files as FileList

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.localPicData = { src: e.target.result as string, file: localPhotoFile }
            afterOnLoadFn ? afterOnLoadFn(this.localPicData) : null
        }
        fileReader.readAsDataURL(localPhotoFile[0])
    }

    resetLocalPicData() {
        this.localPicData = { src: undefined, file: undefined }
    }

    // helper func
    isFileExist(fileList: FileList) {
        if (fileList && fileList.length == 0) {
            return false
        }
        return true
    }
}

//  file input tag - example
// <div
//   class="add-avatar"
//   (click)="add_member_avatar.click()"
// >
//   <input
//     type="file" accept="image/*" hidden
//     #add_member_avatar
//     (change) = " onInputFileChange(add_member_avatar) "
//   >
// </div>
