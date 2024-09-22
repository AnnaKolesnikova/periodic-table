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
import { RxState } from '@rx-angular/state';
import { CommonModule } from '@angular/common';

interface TableState {
  data: PeriodicElement[];
  loading: boolean;
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [...MaterialModules, FormsModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [RxState],
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
  isLoading$ = this.state.select('loading');

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private state: RxState<TableState>
  ) {
    this.state.set({
      data: [],
      loading: true,
    });

    this.state.select('data').subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    this.state.connect(this.dataService.fetchData(), (_state, data) => ({
      data,
      loading: false,
    }));

    this.filterSubject.pipe(debounceTime(2000)).subscribe((filterValue) => {
      this.applyFilter(filterValue);
    });
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog',
      data: { element: { ...element } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.state.set({
          data: this.dataSource.data.map((item) =>
            item.name === element.name ? result : item
          ),
        });
      }
    });
  }

  onFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value || '';
    this.filterSubject.next(filterValue);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
