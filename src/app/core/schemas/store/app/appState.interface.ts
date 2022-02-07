import { Toast } from './toast.interface'
import { DrawerTypes, Drawer } from './drawer.interface'
import { ModalData, Modal } from './modal.interface'
import { Registration } from './registration.interface'

export interface AppStateInterface {
    toast: Toast
    drawer: Drawer
    modal: Modal
    registration: Registration
}
