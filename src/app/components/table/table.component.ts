import { Component, OnInit } from '@angular/core';
import { MaterialModules } from '../../shared/modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../services/data.service';
import { PeriodicElement } from '../../shared/models/periodicElement.model';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [...MaterialModules, FormsModule],
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
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filterSubject = new Subject<string>();
  loading: boolean = true;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataService.fetchData().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.loading = false;
      },
    });

    this.filterSubject.pipe(debounceTime(2000)).subscribe((filterValue) => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    });
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog',
      data: { element: { ...element } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (item) => item.name === element.name
        );
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }
}
