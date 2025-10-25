import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LateInGridComponent } from './features/late-in-management/components/late-in-grid/late-in-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LateInGridComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo">
          <h1>🔴 Unifi</h1>
          <p>Late In Exception Management</p>
        </div>
      </header>
      
      <main class="app-content">
        <app-late-in-grid></app-late-in-grid>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #EAEAEA;
      font-family: Arial, sans-serif;
    }
    
    .app-header {
      background: linear-gradient(135deg, #B42025 0%, #EB2227 100%);
      color: white;
      padding: 20px 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .logo h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    
    .logo p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    
    .app-content {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .welcome-card h2 {
      color: #211F20;
      margin-top: 0;
      font-size: 28px;
    }
    
    .welcome-card p {
      color: #757575;
      font-size: 16px;
      line-height: 1.6;
    }
    
    .info-section {
      background: #f7fafc;
      border-left: 4px solid #B42025;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .info-section h3 {
      color: #211F20;
      margin-top: 0;
    }
    
    .info-section ul {
      list-style: none;
      padding: 0;
    }
    
    .info-section li {
      padding: 8px 0;
      color: #211F20;
      font-size: 15px;
    }
    
    .status {
      background: #EBE1C3;
      border-left: 4px solid #C7AA5B;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .status p {
      margin: 0;
      color: #211F20;
    }
    
    code {
      background: #211F20;
      color: #EBE1C3;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    
    strong {
      color: #B42025;
    }
  `]
})
export class AppComponent {
  title = 'unifi-late-in-app';
}
