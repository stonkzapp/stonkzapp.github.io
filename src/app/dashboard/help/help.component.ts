import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'stz-help',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatExpansionModule, CardComponent],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {}
