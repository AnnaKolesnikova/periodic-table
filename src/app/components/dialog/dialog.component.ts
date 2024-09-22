import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PeriodicElement } from '../../shared/models/periodicElement.model';
import { MaterialModules } from '../../shared/modules/material.module';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [...MaterialModules, FormsModule],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element: PeriodicElement }
  ) {}

  onModelChange(
    value: any,
    element: PeriodicElement,
    field: keyof PeriodicElement
  ) {
    if (field === 'position' || field === 'weight') {
      element[field] = value as number;
    } else if (field === 'name' || field === 'symbol') {
      element[field] = value as string;
    }
  }

  onSave(): void {
    this.dialogRef.close(this.data.element);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
