import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../services/profile.service';
import {IOrder} from '../models';

enum Tabs {
  Orders = 0,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(private profileService: ProfileService) {}

  private selectedTab: Tabs = Tabs.Orders;
  private orders: IOrder[];

  private displayedColumns = [
    'date',
    'time',
    'doctor',
    'status',
    'symbol',
  ];

  ngOnInit() {
    this.profileService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  setTab(tabIndex: Tabs): void {
    this.selectedTab = tabIndex;
  }

  userInfo() {
    return this.profileService.getCurrentUser();
  }

}
