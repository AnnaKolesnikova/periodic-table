import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PeriodicElement } from '../../shared/models/periodicElement.model';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  dataSource: PeriodicElement[] = [];
  loading: boolean = true;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataService.fetchData().subscribe({
      next: (response) => {
        this.dataSource = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.loading = false;
      },
    });
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog',
      data: { element: { ...element } }, // pass element's copy to dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // find index in data copy
        const index = this.dataSource.findIndex(
          (item) => item.name === element.name
        );
        if (index !== -1) {
          // update element and create new link to data array
          const updatedDataSource = [...this.dataSource];
          updatedDataSource[index] = result;
          this.dataSource = updatedDataSource; // create new link to data array
        }
      }
    });
  }
}
