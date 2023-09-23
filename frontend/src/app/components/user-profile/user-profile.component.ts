import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, map, tap } from 'rxjs';
import { User } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userId: number = null!;
  private sub: Subscription = null!;
  user: User = null!;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }


  ngOnInit(): void {

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.userService.findById(this.userId).pipe(
        map((user: User) => this.user = user)
      ).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
