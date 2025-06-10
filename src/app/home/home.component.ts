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
  longUrl : string = '';
  shortId : string = '';
  shortUrl : string = '';
  domainName : string = "https://nanofy.com/";
  isURLAlreadyShort : boolean = false;
  isValidUrl : boolean = true;
  clickCount: number | null = null;
  urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

  constructor(private http: HttpClient, private router: Router) {}

  shorten() {
    if (!this.longUrl) return;
    this.isValidUrl = this.urlRegex.test(this.longUrl);

    if(!this.isValidUrl) {
      this.isURLAlreadyShort = false;
      this.shortUrl = "";
      return;
    }

    else if(this.longUrl.length <= (this.domainName.length + 6)) {
      this.isURLAlreadyShort = true;
      this.shortUrl = "";
      return;
    }

    this.http
      .post<{ shortId: string }>('https://shortenurl-backend-taj4.onrender.com/url', {
        redirectURL: this.longUrl,
      })
      .subscribe({
        next: ({ shortId }) => {
          this.shortId = shortId;
          this.shortUrl = `https://shortenurl-backend-taj4.onrender.com/${shortId}`;
          this.clickCount = 0;
          this.isURLAlreadyShort = false;
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
