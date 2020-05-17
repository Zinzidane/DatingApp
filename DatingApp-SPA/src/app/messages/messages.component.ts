import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.messages = data.messages.result;
      this.pagination = data.messages.pagination;
    });
  }

  loadMessages() {
    this.usersService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      });
  }

  deleteMessage(id: number) {
    this.alertify.confirm(
      'Are you sure you want to delete this message',
      () => {
        this.usersService
          .deleteMessage(id, this.authService.decodedToken.nameid)
          .subscribe(() => {
            this.messages.splice(
              this.messages.findIndex((m) => m.id === id),
              1
            );
            this.alertify.success('Message has been deleted');
          });
      }
    );
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
