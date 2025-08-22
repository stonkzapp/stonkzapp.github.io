import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  address: string = 'Av Estrela do sul, 123, Uberlândia, Minas Gerais';
  socialLinks: { icon: string; link: string }[] = [
    { icon: 'instagram', link: 'https://instagram.com/stonkzapp' },
    { icon: 'linkedin', link: 'https://linkedin.com/company/stonkzapp' },
  ];
  pageLinks: { name: string; link: string }[] = [
    { name: 'Sobre nós', link: '/about' },
    { name: 'Contato', link: '/contact' },
    { name: 'Política de Privacidade', link: '/privacy' },
  ];
}
