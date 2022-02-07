import { Component, OnInit, Input } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage'
import { Observable } from 'rxjs'
import { finalize, tap } from 'rxjs/operators'

@Component({
    selector: 'rw-upload-task',
    templateUrl: './upload-task.component.html',
    styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit {
    @Input() file: File

    task: AngularFireUploadTask

    percentage: Observable<number>
    snapshot: Observable<any>
    downloadURL

    constructor(private angularFireStorage: AngularFireStorage, private angularFirestore: AngularFirestore) {}

    ngOnInit() {
        this.startUpload()
    }

    startUpload() {
        // The storage path
        const path = `test/${Date.now()}_${this.file.name}`

        // Reference to storage bucket
        const ref = this.angularFireStorage.ref(path)

        // The main task
        this.task = this.angularFireStorage.upload(path, this.file)

        // Progress monitoring
        this.percentage = this.task.percentageChanges()

        this.snapshot = this.task.snapshotChanges().pipe(
            tap(console.log),
            // The file's download URL
            finalize(async () => {
                this.downloadURL = await ref.getDownloadURL().toPromise()
                this.angularFirestore.collection('files').add({ downloadURL: this.downloadURL, path })
            })
        )
    }

    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot
    }
}
