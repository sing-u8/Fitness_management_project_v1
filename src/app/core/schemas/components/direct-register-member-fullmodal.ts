import { CreateUserRequestBody } from '@services/center-users.service'
export interface OutputType {
    reqBody: CreateUserRequestBody
    file: FileList
    cb?: () => void
}
