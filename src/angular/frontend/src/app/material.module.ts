import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSnackBarModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSnackBarModule
    ],
    exports: [
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatFormFieldModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSnackBarModule
    ]
})
export class MaterialModule { }
