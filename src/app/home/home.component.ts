import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  longUrl = '';
  shortId = '';
  shortUrl = '';
  clickCount: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  shorten() {
    if (!this.longUrl) return;

    this.http
      .post<{ shortId: string }>('https://shortenurl-backend-taj4.onrender.com/url', {
        redirectURL: this.longUrl,
      })
      .subscribe({
        next: ({ shortId }) => {
          this.shortId = shortId;
          this.shortUrl = `https://shortenurl-backend-taj4.onrender.com/${shortId}`;
          this.clickCount = 0;
        },
        error: () => alert('Server error – check backend console.'),
      });
  }

  getTotalClicks() {
    this.http
            .get<{ totalClicks: number }>(
              `https://shortenurl-backend-taj4.onrender.com/analytics/${this.shortId}`
            )
            .subscribe((a) => {
              console.log(a.totalClicks);
              return this.clickCount = a.totalClicks});
  }

  goToHome() {
  this.router.navigateByUrl('/').then(() => {
    window.location.reload(); 
  });
  }
}
