import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/services/authentication-service/authentication.service';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  filterValue?: string;
  dataSource?: UserData;
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'userName', 'role'];



  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.initDataSource();
  }


  ngOnInit(): void {

  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    if (this.filterValue == null) {
      page++;
      this.userService.findAll(page, size).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe()
    } else {
      this.userService.paginateByUserName(page, size, this.filterValue).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe()
    }

  }

  paginateByUserName(filterValue: string | any) {
    this.userService.paginateByUserName(0, 10, filterValue).pipe(
      map((userData: UserData) => {
        this.dataSource = userData;
      })
    ).subscribe();
  }

  navigateToProfile(userId: string) {
    this.router.navigate(['./' + userId], { relativeTo: this.activatedRoute });
  }
}
